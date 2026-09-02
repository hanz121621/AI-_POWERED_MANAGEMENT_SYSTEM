using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Reports
{
    public class ProjectDashboardService
        : IProjectDashboardService
    {
        private readonly IProjectDashboardRepository _repository;

        public ProjectDashboardService(
            IProjectDashboardRepository repository)
        {
            _repository = repository;
        }

        // =========================================================
        // REPORT-001
        // VIEW PROJECT DASHBOARD
        // =========================================================

        public async Task<(
            bool Success,
            string Message,
            ProjectDashboardDto? Data
        )> GetProjectDashboardAsync(
            Guid managerId,
            Guid projectId)
        {
            // =====================================================
            // VALIDATION
            // =====================================================

            if (managerId == Guid.Empty)
            {
                return (
                    false,
                    "Manager identity is required.",
                    null
                );
            }

            if (projectId == Guid.Empty)
            {
                return (
                    false,
                    "Project ID is required.",
                    null
                );
            }

            // =====================================================
            // AUTHORIZATION
            // Manager can only view assigned projects.
            // =====================================================

            var project =
                await _repository.GetAuthorizedProjectAsync(
                    projectId,
                    managerId);

            if (project == null)
            {
                return (
                    false,
                    "Project not found or you are not authorized to view this dashboard.",
                    null
                );
            }

            // =====================================================
            // GET ACTUAL DATA
            // =====================================================

            var tasks =
                await _repository.GetProjectTasksAsync(
                    projectId);

            var activeSprint =
                await _repository.GetActiveSprintAsync(
                    projectId);

            var team =
                await _repository.GetProjectTeamAsync(
                    projectId);

            // =====================================================
            // TASK STATISTICS
            // =====================================================

            var completedTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Completed);

            var inProgressTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.InProgress);

            var inReviewTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.InReview);

            var todoTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Todo);

            var blockedTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Blocked);

            var remainingTasks =
                tasks.Count(t =>
                    t.Status != ProjectTaskStatus.Completed);

            // =====================================================
            // OVERDUE TASKS
            // =====================================================

            var now = DateTime.UtcNow;

            var overdueTasks =
                tasks.Count(t =>
                    t.DueDate < now &&
                    t.Status != ProjectTaskStatus.Completed);

            // =====================================================
            // OVERALL PROJECT PROGRESS
            //
            // Based on actual project tasks.
            // =====================================================

            decimal? overallProgress = null;

            if (tasks.Count > 0)
            {
                overallProgress =
                    Math.Round(
                        (decimal)completedTasks /
                        tasks.Count *
                        100m,
                        2);
            }

            // =====================================================
            // TEAM
            // =====================================================

            Guid? teamId = team?.Id;

            string? teamName = team?.Name;

            int memberCount = 0;
            int developerCount = 0;
            int staffCount = 0;

            if (team != null)
            {
                var activeMembers =
                    team.TeamMembers
                        .Where(m => m.IsActive)
                        .ToList();

                memberCount =
                    activeMembers.Count;

                // Contributor classification is dynamic.
                // We count available contributor type information.
                developerCount =
                    activeMembers.Count(m =>
                        m.ContributorType != null &&
                        string.Equals(
                            m.ContributorType.Name,
                            "Developer",
                            StringComparison.OrdinalIgnoreCase));

                staffCount =
                    activeMembers.Count(m =>
                        m.ContributorType != null &&
                        string.Equals(
                            m.ContributorType.Name,
                            "Staff",
                            StringComparison.OrdinalIgnoreCase));
            }

            // =====================================================
            // TEAM LEADER
            // =====================================================

            var teamLeader = team != null
                ? await _repository.GetTeamLeaderAsync(team.Id)
                : null;

            // =====================================================
            // TEAM WORKLOAD
            //
            // Work assigned to members of the project Team.
            // =====================================================

            var teamMemberIds =
                team?.TeamMembers
                    .Where(m => m.IsActive)
                    .Select(m => m.UserId)
                    .ToHashSet()
                ?? new HashSet<Guid>();

            var teamAssignedTasks =
                tasks.Where(t =>
                    t.AssignedContributorSDId.HasValue &&
                    teamMemberIds.Contains(
                        t.AssignedContributorSDId.Value))
                .ToList();

            var teamAssignedWorkItems =
                teamAssignedTasks.Count;

            var estimatedWorkHours =
                teamAssignedTasks.Sum(t =>
                    Math.Max(0, t.EstimatedHours));

            var actualWorkHours =
                teamAssignedTasks.Sum(t =>
                    Math.Max(0, t.ActualHours));

            // =====================================================
            // TEAM PROGRESS
            // =====================================================

            decimal? teamProgress = null;

            if (teamAssignedTasks.Count > 0)
            {
                var completedTeamTasks =
                    teamAssignedTasks.Count(t =>
                        t.Status == ProjectTaskStatus.Completed);

                teamProgress =
                    Math.Round(
                        (decimal)completedTeamTasks /
                        teamAssignedTasks.Count *
                        100m,
                        2);
            }

            // =====================================================
            // TEAM LEADER METRICS
            // =====================================================

            int teamLeaderTasksCreated = 0;
            int teamLeaderTasksAssigned = 0;
            decimal? teamLeaderProgress = null;

            if (teamLeader?.User != null)
            {
                var leaderId =
                    teamLeader.UserId;

                teamLeaderTasksCreated =
                    tasks.Count(t =>
                        t.CreatedBy == leaderId);

                teamLeaderTasksAssigned =
                    tasks.Count(t =>
                        t.CreatedBy == leaderId &&
                        t.AssignedContributorSDId.HasValue);

                var leaderTasks =
                    tasks.Where(t =>
                        t.CreatedBy == leaderId)
                    .ToList();

                if (leaderTasks.Count > 0)
                {
                    var completedLeaderTasks =
                        leaderTasks.Count(t =>
                            t.Status ==
                            ProjectTaskStatus.Completed);

                    teamLeaderProgress =
                        Math.Round(
                            (decimal)completedLeaderTasks /
                            leaderTasks.Count *
                            100m,
                            2);
                }
            }

            // =====================================================
            // SPRINT PROGRESS
            // =====================================================

            decimal? sprintProgress = null;

            if (activeSprint != null)
            {
                var sprintTasks =
                    tasks.Where(t =>
                        t.SprintId == activeSprint.Id)
                    .ToList();

                if (sprintTasks.Count > 0)
                {
                    var completedSprintTasks =
                        sprintTasks.Count(t =>
                            t.Status ==
                            ProjectTaskStatus.Completed);

                    sprintProgress =
                        Math.Round(
                            (decimal)completedSprintTasks /
                            sprintTasks.Count *
                            100m,
                            2);
                }
            }

            // =====================================================
            // UPCOMING DEADLINES
            // =====================================================

            var upcomingDeadlines =
                new List<ProjectDashboardDeadlineDto>();

            // Project deadline
            if (project.Deadline >= now)
            {
                upcomingDeadlines.Add(
                    new ProjectDashboardDeadlineDto
                    {
                        Id = project.Id,
                        Type = "Project",
                        Name = project.Name,
                        Deadline = project.Deadline
                    });
            }

            // Sprint deadline
            if (activeSprint != null &&
                activeSprint.EndDate >= now)
            {
                upcomingDeadlines.Add(
                    new ProjectDashboardDeadlineDto
                    {
                        Id = activeSprint.Id,
                        Type = "Sprint",
                        Name = activeSprint.Name,
                        Deadline = activeSprint.EndDate
                    });
            }

            // Task deadlines
            foreach (var task in tasks)
            {
                if (task.Status != ProjectTaskStatus.Completed &&
                    task.DueDate >= now)
                {
                    upcomingDeadlines.Add(
                        new ProjectDashboardDeadlineDto
                        {
                            Id = task.Id,
                            Type = "Task",
                            Name = task.Title,
                            Deadline = task.DueDate
                        });
                }
            }

            upcomingDeadlines =
                upcomingDeadlines
                    .OrderBy(d => d.Deadline)
                    .Take(10)
                    .ToList();

            // =====================================================
            // ACTIVITY
            // =====================================================

            var activities =
                await _repository.GetProjectActivitiesAsync(
                    projectId);

            var recentActivities =
                activities
                    .Select(a =>
                        new ProjectDashboardActivityDto
                        {
                            Id = a.Id,
                            UserId = a.UserId,
                            Action = a.Action,
                            ActivityType = a.ActivityType,
                            EntityType = a.EntityType,
                            EntityId = a.EntityId,
                            Description = a.Description,
                            CreatedAt = a.CreatedAt
                        })
                    .ToList();

            // =====================================================
            // PROGRESS STATE
            // =====================================================

            var progressState =
                overallProgress.HasValue
                    ? "Available"
                    : "InsufficientData";

            // =====================================================
            // BUILD DASHBOARD
            // =====================================================

            var dashboard =
                new ProjectDashboardDto
                {
                    ProjectId = project.Id,
                    ProjectName = project.Name,

                    OverallProjectProgress =
                        overallProgress,

                    ProgressState =
                        progressState,

                    ProjectDeadline =
                        project.Deadline,

                    ActiveSprintId =
                        activeSprint?.Id,

                    ActiveSprintName =
                        activeSprint?.Name,

                    ActiveSprintGoal =
                        activeSprint?.Goal,

                    ActiveSprintStatus =
                        activeSprint?.Status.ToString(),

                    SprintStartDate =
                        activeSprint?.StartDate,

                    SprintEndDate =
                        activeSprint?.EndDate,

                    SprintProgressPercentage =
                        sprintProgress,

                    TotalTasks =
                        tasks.Count,

                    CompletedTasks =
                        completedTasks,

                    InProgressTasks =
                        inProgressTasks,

                    InReviewTasks =
                        inReviewTasks,

                    TodoTasks =
                        todoTasks,

                    BlockedTasks =
                        blockedTasks,

                    OverdueTasks =
                        overdueTasks,

                    RemainingTasks =
                        remainingTasks,

                    TeamId =
                        teamId,

                    TeamName =
                        teamName,

                    TeamProgressPercentage =
                        teamProgress,

                    TeamAssignedWorkItems =
                        teamAssignedWorkItems,

                    TeamMemberCount =
                        memberCount,

                    TeamDeveloperCount =
                        developerCount,

                    TeamStaffCount =
                        staffCount,

                    TeamLeaderId =
                        teamLeader?.UserId,

                    TeamLeaderName =
                        teamLeader?.User?.FullName,

                    TeamLeaderTasksCreated =
                        teamLeaderTasksCreated,

                    TeamLeaderTasksAssigned =
                        teamLeaderTasksAssigned,

                    TeamLeaderProgressPercentage =
                        teamLeaderProgress,

                    EstimatedWorkHours =
                        estimatedWorkHours,

                    ActualWorkHours =
                        actualWorkHours,

                    UpcomingDeadlines =
                        upcomingDeadlines,

                    RecentActivities =
                        recentActivities
                };

            return (
                true,
                "Project dashboard retrieved successfully.",
                dashboard
            );
        }
    }
}
