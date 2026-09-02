using AI_PMS.Application.DTOs.Teams;
using AI_PMS.Application.Interfaces.Repositories.Teams;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Teams;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Teams
{
    // =========================================================
    // TEAM LEADER SPRINT SERVICE
    // =========================================================

    public class TeamLeaderSprintService : ITeamLeaderSprintService
    {
        private readonly ITeamLeaderSprintRepository _sprintRepository;
        private readonly IUserRepository _userRepository;

        public TeamLeaderSprintService(
            ITeamLeaderSprintRepository sprintRepository,
            IUserRepository userRepository)
        {
            _sprintRepository = sprintRepository;
            _userRepository = userRepository;
        }

        // =========================================================
        // TL-SPRINT-001
        // VIEW SPRINT TASKS
        // =========================================================

        public async Task<TeamLeaderSprintTasksDto?>
            GetSprintTasksAsync(
                Guid teamLeaderId,
                Guid sprintId,
                ProjectTaskStatus? status = null,
                string? priority = null,
                Guid? assignedUserId = null,
                DateTime? deadlineFrom = null,
                DateTime? deadlineTo = null,
                string? search = null,
                bool sortDescending = false)
        {
            if (teamLeaderId == Guid.Empty)
            {
                return null;
            }

            if (sprintId == Guid.Empty)
            {
                return null;
            }

            // -----------------------------------------------------
            // GET SPRINT
            // -----------------------------------------------------

            var sprint =
                await _sprintRepository
                    .GetSprintAsync(sprintId);

            if (sprint == null)
            {
                return null;
            }

            // -----------------------------------------------------
            // SPRINT MUST BELONG TO TEAM
            // -----------------------------------------------------

            if (!sprint.TeamId.HasValue ||
                sprint.TeamId.Value == Guid.Empty)
            {
                return null;
            }

            var teamId = sprint.TeamId.Value;

            // -----------------------------------------------------
            // VERIFY TEAM LEADER ACCESS
            // -----------------------------------------------------

            var hasAccess =
                await _sprintRepository
                    .HasTeamLeaderAccessAsync(
                        teamId,
                        teamLeaderId);

            if (!hasAccess)
            {
                return null;
            }

            // -----------------------------------------------------
            // GET TASKS
            // -----------------------------------------------------

            var tasks =
                await _sprintRepository
                    .GetSprintTasksAsync(sprintId);

            tasks = tasks
                .Where(t => !t.IsDeleted)
                .ToList();

            // -----------------------------------------------------
            // FILTER STATUS
            // -----------------------------------------------------

            if (status.HasValue)
            {
                tasks = tasks
                    .Where(t => t.Status == status.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // FILTER PRIORITY
            // -----------------------------------------------------

            if (!string.IsNullOrWhiteSpace(priority) &&
                Enum.TryParse<TaskPriority>(
                    priority,
                    true,
                    out var parsedPriority))
            {
                tasks = tasks
                    .Where(t => t.Priority == parsedPriority)
                    .ToList();
            }

            // -----------------------------------------------------
            // FILTER ASSIGNED CONTRIBUTOR
            // -----------------------------------------------------

            if (assignedUserId.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.AssignedContributorSDId ==
                        assignedUserId.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // FILTER DEADLINE FROM
            // -----------------------------------------------------

            if (deadlineFrom.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.DueDate >= deadlineFrom.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // FILTER DEADLINE TO
            // -----------------------------------------------------

            if (deadlineTo.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.DueDate <= deadlineTo.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // SEARCH
            // -----------------------------------------------------

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchTerm = search.Trim();

                tasks = tasks
                    .Where(t =>
                        (!string.IsNullOrWhiteSpace(t.Title) &&
                         t.Title.Contains(
                             searchTerm,
                             StringComparison.OrdinalIgnoreCase))
                        ||
                        (!string.IsNullOrWhiteSpace(t.Description) &&
                         t.Description.Contains(
                             searchTerm,
                             StringComparison.OrdinalIgnoreCase)))
                    .ToList();
            }

            // -----------------------------------------------------
            // SORT
            // -----------------------------------------------------

            tasks = sortDescending
                ? tasks
                    .OrderByDescending(t => t.DueDate)
                    .ToList()
                : tasks
                    .OrderBy(t => t.DueDate)
                    .ToList();

            // -----------------------------------------------------
            // COUNTS
            // -----------------------------------------------------

            var totalTasks = tasks.Count;

            var completedTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Completed);

            var todoTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Todo);

            var inProgressTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.InProgress);

            var reviewTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.InReview);

            var blockedTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Blocked);

            var remainingTasks =
                totalTasks - completedTasks;

            // -----------------------------------------------------
            // PROGRESS
            // -----------------------------------------------------

            var progressPercentage =
                totalTasks == 0
                    ? 0
                    : Math.Round(
                        (double)completedTasks /
                        totalTasks *
                        100,
                        2);

            // -----------------------------------------------------
            // MAP TASKS
            // -----------------------------------------------------

            var taskDtos =
                new List<TeamLeaderSprintTaskDto>();

            foreach (var task in tasks)
            {
                string? developerName = null;

                if (task.AssignedContributorSDId.HasValue)
                {
                    var developer =
                        await _userRepository
                            .GetByIdAsync(
                                task.AssignedContributorSDId.Value);

                    developerName =
                        developer?.FullName;
                }

                taskDtos.Add(
                    new TeamLeaderSprintTaskDto
                    {
                        Id = task.Id,

                        SprintId = task.SprintId,

                        Title = task.Title,

                        Description = task.Description,

                        AssignedContributorSDId =
                            task.AssignedContributorSDId,

                        AssignedDeveloperName =
                            developerName,

                        Priority =
                            task.Priority,

                        Status =
                            task.Status,

                        EstimatedHours =
                            task.EstimatedHours,

                        ActualHours =
                            task.ActualHours,

                        DueDate =
                            task.DueDate,

                        CreatedAt =
                            task.CreatedAt,

                        UpdatedAt =
                            task.UpdatedAt
                    });
            }

            // -----------------------------------------------------
            // RECORD ACCESS
            // -----------------------------------------------------

            await _sprintRepository
                .RecordSprintAccessAsync(
                    teamLeaderId,
                    sprintId);

            // -----------------------------------------------------
            // RETURN
            // -----------------------------------------------------

            return new TeamLeaderSprintTasksDto
            {
                SprintId = sprint.Id,

                ProjectId = sprint.ProjectId,

                TeamId = sprint.TeamId,

                SprintName = sprint.Name,

                Goal = sprint.Goal,

                StartDate = sprint.StartDate,

                EndDate = sprint.EndDate,

                Status = sprint.Status,

                TotalTasks = totalTasks,

                CompletedTasks = completedTasks,

                RemainingTasks = remainingTasks,

                InProgressTasks = inProgressTasks,

                BlockedTasks = blockedTasks,

                ProgressPercentage =
                    progressPercentage,

                HasTasks =
                    taskDtos.Any(),

                Message =
                    taskDtos.Any()
                        ? null
                        : "No sprint tasks assigned.",

                Tasks = taskDtos
            };
        }

        // =========================================================
        // TL-SPRINT-002
        // VIEW SPRINT GOALS AND PROGRESS
        // =========================================================

        public async Task<TeamLeaderSprintProgressDto?>
            GetSprintProgressAsync(
                Guid teamLeaderId,
                Guid sprintId)
        {
            if (teamLeaderId == Guid.Empty)
            {
                return null;
            }

            if (sprintId == Guid.Empty)
            {
                return null;
            }

            // -----------------------------------------------------
            // GET SPRINT
            // -----------------------------------------------------

            var sprint =
                await _sprintRepository
                    .GetSprintAsync(sprintId);

            if (sprint == null)
            {
                return null;
            }

            // -----------------------------------------------------
            // SPRINT MUST HAVE TEAM
            // -----------------------------------------------------

            if (!sprint.TeamId.HasValue ||
                sprint.TeamId.Value == Guid.Empty)
            {
                return null;
            }

            var teamId = sprint.TeamId.Value;

            // -----------------------------------------------------
            // VERIFY TEAM LEADER ACCESS
            // -----------------------------------------------------

            var hasAccess =
                await _sprintRepository
                    .HasTeamLeaderAccessAsync(
                        teamId,
                        teamLeaderId);

            if (!hasAccess)
            {
                return null;
            }

            // -----------------------------------------------------
            // GET TASKS
            // -----------------------------------------------------

            var tasks =
                await _sprintRepository
                    .GetSprintTasksAsync(sprintId);

            tasks = tasks
                .Where(t => !t.IsDeleted)
                .ToList();

            // -----------------------------------------------------
            // TASK COUNTS
            // -----------------------------------------------------

            var totalTasks = tasks.Count;

            var completedTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Completed);

            var todoTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Todo);

            var inProgressTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.InProgress);

            var reviewTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.InReview);

            var blockedTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Blocked);

            var remainingTasks =
                totalTasks - completedTasks;

            // -----------------------------------------------------
            // COMPLETION PERCENTAGE
            // -----------------------------------------------------

            var completionPercentage =
                totalTasks == 0
                    ? 0
                    : Math.Round(
                        (double)completedTasks /
                        totalTasks *
                        100,
                        2);

            // -----------------------------------------------------
            // HOURS
            // -----------------------------------------------------

            var totalEstimatedHours =
                tasks.Sum(t => t.EstimatedHours);

            var totalActualHours =
                tasks.Sum(t => t.ActualHours);

            // -----------------------------------------------------
            // ASSIGNMENT
            // -----------------------------------------------------

            var assignedTaskCount =
                tasks.Count(t =>
                    t.AssignedContributorSDId.HasValue);

            var unassignedTaskCount =
                tasks.Count(t =>
                    !t.AssignedContributorSDId.HasValue);

            // -----------------------------------------------------
            // MEMBER PROGRESS
            // -----------------------------------------------------

            var memberProgress =
                new List<TeamLeaderMemberProgressDto>();

            var groups =
                tasks
                    .Where(t =>
                        t.AssignedContributorSDId.HasValue)
                    .GroupBy(t =>
                        t.AssignedContributorSDId!.Value)
                    .ToList();

            foreach (var group in groups)
            {
                var userId = group.Key;

                var user =
                    await _userRepository
                        .GetByIdAsync(userId);

                if (user == null)
                {
                    continue;
                }

                var memberTasks =
                    group.ToList();

                var memberTotal =
                    memberTasks.Count;

                var memberCompleted =
                    memberTasks.Count(t =>
                        t.Status ==
                        ProjectTaskStatus.Completed);

                var memberInProgress =
                    memberTasks.Count(t =>
                        t.Status ==
                        ProjectTaskStatus.InProgress);

                var memberBlocked =
                    memberTasks.Count(t =>
                        t.Status ==
                        ProjectTaskStatus.Blocked);

                var memberRemaining =
                    memberTotal -
                    memberCompleted;

                var memberPercentage =
                    memberTotal == 0
                        ? 0
                        : Math.Round(
                            (double)memberCompleted /
                            memberTotal *
                            100,
                            2);

                memberProgress.Add(
                    new TeamLeaderMemberProgressDto
                    {
                        UserId = userId,

                        FullName =
                            user.FullName,

                        TotalTasks =
                            memberTotal,

                        CompletedTasks =
                            memberCompleted,

                        RemainingTasks =
                            memberRemaining,

                        InProgressTasks =
                            memberInProgress,

                        BlockedTasks =
                            memberBlocked,

                        CompletionPercentage =
                            memberPercentage,

                        EstimatedHours =
                            memberTasks.Sum(
                                t => t.EstimatedHours),

                        ActualHours =
                            memberTasks.Sum(
                                t => t.ActualHours)
                    });
            }

            // -----------------------------------------------------
            // RECORD ACCESS
            // -----------------------------------------------------

            await _sprintRepository
                .RecordSprintAccessAsync(
                    teamLeaderId,
                    sprintId);

            // -----------------------------------------------------
            // RETURN
            // -----------------------------------------------------

            return new TeamLeaderSprintProgressDto
            {
                SprintId = sprint.Id,

                ProjectId = sprint.ProjectId,

                TeamId = sprint.TeamId,

                SprintName = sprint.Name,

                Goal = sprint.Goal,

                StartDate = sprint.StartDate,

                EndDate = sprint.EndDate,

                Status = sprint.Status,

                TotalTasks = totalTasks,

                CompletedTasks = completedTasks,

                RemainingTasks = remainingTasks,

                TodoTasks = todoTasks,

                InProgressTasks =
                    inProgressTasks,

                ReviewTasks =
                    reviewTasks,

                BlockedTasks =
                    blockedTasks,

                CompletionPercentage =
                    completionPercentage,

                TotalEstimatedHours =
                    totalEstimatedHours,

                TotalActualHours =
                    totalActualHours,

                AssignedTaskCount =
                    assignedTaskCount,

                UnassignedTaskCount =
                    unassignedTaskCount,

                Message =
                    totalTasks == 0
                        ? "No sprint tasks assigned."
                        : null
            };
        }
    }
}
