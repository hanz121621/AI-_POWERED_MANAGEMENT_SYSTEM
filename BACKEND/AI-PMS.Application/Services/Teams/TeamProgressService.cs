
using AI_PMS.Application.DTOs.Teams;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Teams;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Teams
{
    public class TeamProgressService
        : ITeamProgressService
    {
        private readonly ITeamProgressRepository _repository;

        public TeamProgressService(
            ITeamProgressRepository repository)
        {
            _repository = repository;
        }


        // =========================================================
        // TEAM-M-005
        // REVIEW TEAM PROGRESS
        // =========================================================

        public async Task<(
            bool Success,
            string Message,
            TeamProgressDto? Data
        )> ReviewTeamProgressAsync(
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
            // VERIFY MANAGER AUTHORIZATION
            // -----------------------------------------------------

            var team =
                await _repository.GetAuthorizedTeamAsync(
                    teamId,
                    managerId);

            if (team == null)
            {
                return (
                    false,
                    "Team not found or you are not authorized to review this team's progress.",
                    null
                );
            }


            // -----------------------------------------------------
            // VERIFY PROJECT AUTHORIZATION
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
            // GET CURRENT TEAM LEADER
            // -----------------------------------------------------

            var teamLeader =
                await _repository.GetTeamLeaderAsync(teamId);


            // -----------------------------------------------------
            // GET ACTIVE SPRINT
            // -----------------------------------------------------

            var sprint =
                await _repository.GetActiveSprintAsync(teamId);


            // -----------------------------------------------------
            // BASE RESULT
            // -----------------------------------------------------

            var result = new TeamProgressDto
            {
                TeamId = team.Id,
                TeamName = team.Name,

                ProjectId = project.Id,
                ProjectName = project.Name,

                HasTeamLeaderData =
                    teamLeader != null &&
                    teamLeader.User != null,

                TeamLeaderId =
                    teamLeader?.UserId,

                TeamLeaderName =
                    teamLeader?.User?.FullName,

                HasSprintData =
                    sprint != null
            };


            // -----------------------------------------------------
            // NO ACTIVE SPRINT
            // -----------------------------------------------------

            if (sprint == null)
            {
                result.DataMessage =
                    teamLeader == null
                        ? "No active Sprint or active Team Leader data is currently available for this team."
                        : "Team Leader data is available, but there is currently no active Sprint assigned to this team.";

                return (
                    true,
                    result.DataMessage,
                    result
                );
            }


            // -----------------------------------------------------
            // SPRINT INFORMATION
            // -----------------------------------------------------

            result.ActiveSprintId =
                sprint.Id;

            result.ActiveSprintName =
                sprint.Name;

            result.ActiveSprintGoal =
                sprint.Goal;

            result.SprintStartDate =
                sprint.StartDate;

            result.SprintEndDate =
                sprint.EndDate;

            result.SprintStatus =
                sprint.Status.ToString();


            // -----------------------------------------------------
            // GET ACTUAL TASK DATA
            // -----------------------------------------------------

            var tasks =
                await _repository.GetSprintTasksAsync(
                    sprint.Id);

            result.HasTaskData =
                tasks.Count > 0;

            result.TotalTasks =
                tasks.Count;


            // -----------------------------------------------------
            // NO TASK DATA
            // -----------------------------------------------------

            if (tasks.Count == 0)
            {
                result.DataMessage =
                    "The active Sprint exists, but there are currently no tasks available for progress calculation.";

                return (
                    true,
                    result.DataMessage,
                    result
                );
            }


            // -----------------------------------------------------
            // COMPLETED TASKS
            // -----------------------------------------------------

            var completedTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Completed);

            result.CompletedTasks =
                completedTasks;


            // -----------------------------------------------------
            // REMAINING TASKS
            // -----------------------------------------------------

            result.RemainingTasks =
                tasks.Count(t =>
                    t.Status != ProjectTaskStatus.Completed);


            // -----------------------------------------------------
            // BLOCKED TASKS
            // -----------------------------------------------------

            result.BlockedTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Blocked);


            // -----------------------------------------------------
            // OVERDUE TASKS
            // -----------------------------------------------------

            var now = DateTime.UtcNow;

            result.OverdueTasks =
                tasks.Count(t =>
                    t.DueDate < now &&
                    t.Status != ProjectTaskStatus.Completed);


            // -----------------------------------------------------
            // TEAM COMPLETION
            //
            // Based on all actual tasks belonging to the
            // team's active Sprint.
            // -----------------------------------------------------

            result.TeamCompletionPercentage =
                CalculatePercentage(
                    completedTasks,
                    tasks.Count);


            // -----------------------------------------------------
            // SPRINT PROGRESS
            //
            // Calculated from actual completed Sprint tasks.
            // -----------------------------------------------------

            result.SprintProgressPercentage =
                CalculatePercentage(
                    completedTasks,
                    tasks.Count);


            // -----------------------------------------------------
            // CURRENT WORKLOAD
            // -----------------------------------------------------

            var assignedTasks =
                tasks.Where(t =>
                    t.AssignedDeveloperId.HasValue)
                .ToList();

            result.AssignedWorkItems =
                assignedTasks.Count;

            result.EstimatedWorkHours =
                assignedTasks.Sum(t =>
                    Math.Max(0, t.EstimatedHours));

            result.ActualWorkHours =
                assignedTasks.Sum(t =>
                    Math.Max(0, t.ActualHours));


            // -----------------------------------------------------
            // TEAM LEADER PROGRESS
            //
            // Team Leader activity is derived from actual
            // CreatedBy records.
            //
            // This does NOT grant the Manager task-management
            // permissions.
            // -----------------------------------------------------

            if (teamLeader != null)
            {
                var teamLeaderTasks =
                    tasks.Where(t =>
                        t.CreatedBy == teamLeader.UserId)
                    .ToList();

                if (teamLeaderTasks.Count > 0)
                {
                    var completedLeaderTasks =
                        teamLeaderTasks.Count(t =>
                            t.Status ==
                            ProjectTaskStatus.Completed);

                    result.TeamLeaderProgressPercentage =
                        CalculatePercentage(
                            completedLeaderTasks,
                            teamLeaderTasks.Count);
                }
            }


            // -----------------------------------------------------
            // FINAL MESSAGE
            // -----------------------------------------------------

            result.DataMessage =
                "Team progress retrieved successfully.";

            return (
                true,
                result.DataMessage,
                result
            );
        }


        // =========================================================
        // PERCENTAGE CALCULATION
        // =========================================================

        private static decimal? CalculatePercentage(
            int completed,
            int total)
        {
            if (total <= 0)
            {
                return null;
            }

            return Math.Round(
                (decimal)completed /
                total *
                100m,
                2);
        }
    }
}
