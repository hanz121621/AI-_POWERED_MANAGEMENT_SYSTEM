
using AI_PMS.Application.DTOs.Teams;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Teams;

namespace AI_PMS.Application.Services.Teams
{
    public class TeamLeaderWorkMonitoringService
        : ITeamLeaderWorkMonitoringService
    {
        private readonly ITeamLeaderWorkMonitoringRepository
            _repository;

        public TeamLeaderWorkMonitoringService(
            ITeamLeaderWorkMonitoringRepository repository)
        {
            _repository = repository;
        }

        // =========================================================
        // MONITOR TEAM LEADER WORK
        // TEAM-M-004
        // =========================================================

        public async Task<(
            bool Success,
            string Message,
            TeamLeaderWorkMonitoringDto? Data
        )> MonitorTeamLeaderWorkAsync(
            Guid managerId,
            Guid teamId)
        {
            // -----------------------------------------------------
            // VALIDATE MANAGER
            // -----------------------------------------------------

            if (managerId == Guid.Empty)
            {
                return (
                    false,
                    "Manager identity is required.",
                    null
                );
            }

            // -----------------------------------------------------
            // VALIDATE TEAM
            // -----------------------------------------------------

            if (teamId == Guid.Empty)
            {
                return (
                    false,
                    "Team ID is required.",
                    null
                );
            }

            // -----------------------------------------------------
            // MANAGER AUTHORIZATION
            // Manager can only monitor teams assigned to them.
            // -----------------------------------------------------

            var team =
                await _repository.GetAuthorizedTeamAsync(
                    teamId,
                    managerId);

            if (team == null)
            {
                return (
                    false,
                    "Team not found or you are not authorized to monitor this team.",
                    null
                );
            }

            // -----------------------------------------------------
            // GET PROJECT
            // Project must belong to this team and manager.
            // -----------------------------------------------------

            var project =
                await _repository.GetAuthorizedProjectAsync(
                    teamId,
                    managerId);

            if (project == null)
            {
                return (
                    false,
                    "No authorized project was found for this team.",
                    null
                );
            }

            // -----------------------------------------------------
            // DYNAMIC TEAM LEADER
            // Never hard-code Team Leader.
            // -----------------------------------------------------

            var teamLeader =
                await _repository.GetTeamLeaderAsync(teamId);

            if (teamLeader == null ||
                teamLeader.User == null)
            {
                return (
                    false,
                    "No active Team Leader is currently assigned to this team.",
                    null
                );
            }

            // -----------------------------------------------------
            // ACTIVE SPRINT
            // Must come from actual Team/Sprint relationship.
            // -----------------------------------------------------

            var sprint =
                await _repository.GetActiveSprintAsync(teamId);

            if (sprint == null)
            {
                return (
                    true,
                    "Team Leader found, but there is currently no active Sprint assigned to this team.",
                    new TeamLeaderWorkMonitoringDto
                    {
                        TeamId = team.Id,
                        TeamName = team.Name,

                        TeamLeaderId = teamLeader.UserId,
                        TeamLeaderName =
                            teamLeader.User.FullName,
                        TeamLeaderEmail =
                            teamLeader.User.Email,

                        ProjectId = project.Id,
                        ProjectName = project.Name
                    }
                );
            }

            // -----------------------------------------------------
            // GET ACTUAL SPRINT TASKS
            // -----------------------------------------------------

            var tasks =
                await _repository.GetSprintTasksAsync(
                    sprint.Id);

            // -----------------------------------------------------
            // TASK CREATION
            // Tasks actually created by Team Leader.
            // -----------------------------------------------------

            var tasksCreated =
                tasks.Count(t =>
                    t.CreatedBy == teamLeader.UserId);

            // -----------------------------------------------------
            // TASK ASSIGNMENT
            //
            // A task is considered assigned when:
            // - it has an AssignedContributorSDId
            // - it was created by the current Team Leader
            //
            // This reflects the defined workflow:
            //
            // Team Leader -> Task -> Developer/Staff
            // -----------------------------------------------------

            var tasksAssigned =
                tasks.Count(t =>
                    t.CreatedBy == teamLeader.UserId &&
                    t.AssignedContributorSDId.HasValue);

            // -----------------------------------------------------
            // COMPLETED
            //
            // Compare enum as string so this service does not
            // depend on a particular enum member spelling.
            // -----------------------------------------------------

            var completedTasks =
                tasks.Count(t =>
                    IsStatus(t, "Completed"));

            // -----------------------------------------------------
            // IN PROGRESS
            // -----------------------------------------------------

            var inProgressTasks =
                tasks.Count(t =>
                    IsStatus(t, "InProgress") ||
                    IsStatus(t, "In_Progress") ||
                    IsStatus(t, "In Progress"));

            // -----------------------------------------------------
            // BLOCKED
            // -----------------------------------------------------

            var blockedTasks =
                tasks.Count(t =>
                    IsStatus(t, "Blocked"));

            // -----------------------------------------------------
            // OVERDUE
            //
            // A task is overdue when:
            // - deadline has passed
            // - task is not completed
            // -----------------------------------------------------

            var now = DateTime.UtcNow;

            var overdueTasks =
                tasks.Count(t =>
                    t.DueDate < now &&
                    !IsStatus(t, "Completed"));

            // -----------------------------------------------------
            // TEAM WORKLOAD
            //
            // Current assigned work in the Sprint.
            // -----------------------------------------------------

            var assignedTasks =
                tasks.Where(t =>
                    t.AssignedContributorSDId.HasValue);

            var assignedWorkItems =
                assignedTasks.Count();

            var estimatedWorkHours =
                assignedTasks.Sum(t =>
                    Math.Max(0, t.EstimatedHours));

            var actualWorkHours =
                assignedTasks.Sum(t =>
                    Math.Max(0, t.ActualHours));

            // -----------------------------------------------------
            // SPRINT PROGRESS
            //
            // Since TaskItem has no explicit progress percentage,
            // progress is calculated from actual task statuses.
            // -----------------------------------------------------

            decimal sprintProgress = 0;

            if (tasks.Count > 0)
            {
                sprintProgress =
                    Math.Round(
                        (decimal)completedTasks /
                        tasks.Count *
                        100m,
                        2);
            }

            // -----------------------------------------------------
            // TEAM PROGRESS
            //
            // Team progress is based on actual assigned work.
            // -----------------------------------------------------

            decimal teamProgress = 0;

            if (assignedWorkItems > 0)
            {
                var completedAssignedTasks =
                    assignedTasks.Count(t =>
                        IsStatus(t, "Completed"));

                teamProgress =
                    Math.Round(
                        (decimal)completedAssignedTasks /
                        assignedWorkItems *
                        100m,
                        2);
            }
            else
            {
                teamProgress = sprintProgress;
            }

            // -----------------------------------------------------
            // RETURN MONITORING DATA
            // -----------------------------------------------------

            var result =
                new TeamLeaderWorkMonitoringDto
                {
                    TeamId = team.Id,
                    TeamName = team.Name,

                    TeamLeaderId =
                        teamLeader.UserId,

                    TeamLeaderName =
                        teamLeader.User.FullName,

                    TeamLeaderEmail =
                        teamLeader.User.Email,

                    ProjectId =
                        project.Id,

                    ProjectName =
                        project.Name,

                    ActiveSprintId =
                        sprint.Id,

                    ActiveSprintName =
                        sprint.Name,

                    ActiveSprintGoal =
                        sprint.Goal,

                    SprintStartDate =
                        sprint.StartDate,

                    SprintEndDate =
                        sprint.EndDate,

                    SprintStatus =
                        sprint.Status.ToString(),

                    TasksCreated =
                        tasksCreated,

                    TasksAssigned =
                        tasksAssigned,

                    CompletedTasks =
                        completedTasks,

                    InProgressTasks =
                        inProgressTasks,

                    BlockedTasks =
                        blockedTasks,

                    OverdueTasks =
                        overdueTasks,

                    TotalSprintTasks =
                        tasks.Count,

                    AssignedWorkItems =
                        assignedWorkItems,

                    EstimatedWorkHours =
                        estimatedWorkHours,

                    ActualWorkHours =
                        actualWorkHours,

                    TeamProgressPercentage =
                        teamProgress,

                    SprintProgressPercentage =
                        sprintProgress
                };

            return (
                true,
                "Team Leader work retrieved successfully.",
                result
            );
        }

        // =========================================================
        // STATUS HELPER
        // =========================================================

        private static bool IsStatus(
            Domain.Entities.Tasks.TaskItem task,
            string expectedStatus)
        {
            return string.Equals(
                task.Status.ToString(),
                expectedStatus,
                StringComparison.OrdinalIgnoreCase);
        }
    }
}

