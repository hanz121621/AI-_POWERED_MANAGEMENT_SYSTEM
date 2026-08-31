using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Application.Interfaces.Repositories.Sprints;
using AI_PMS.Application.Interfaces.Repositories.TaskComments;
using AI_PMS.Application.DTOs.TaskSubmissions;
using AI_PMS.Application.DTOs.TaskComments;
using AI_PMS.Application.Interfaces.Repositories.TaskSubmissions;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Reports
{
    public class TeamLeaderReportService
        : ITeamLeaderReportService
    {
        private readonly ITeamLeaderReportRepository
            _reportRepository;

        private readonly IActivityLogService
            _activityLogService;

        private readonly ISprintRepository
            _sprintRepository;

        private readonly IUserRepository
            _userRepository;

        private readonly ITaskSubmissionRepository
            _submissionRepository;

        private readonly ITaskCommentRepository
            _commentRepository;

        public TeamLeaderReportService(
            ITeamLeaderReportRepository reportRepository,
            IActivityLogService activityLogService,
            ISprintRepository sprintRepository,
            IUserRepository userRepository,
            ITaskSubmissionRepository submissionRepository,
            ITaskCommentRepository commentRepository)
        {
            _reportRepository = reportRepository;
            _activityLogService = activityLogService;
            _sprintRepository = sprintRepository;
            _userRepository = userRepository;
            _submissionRepository = submissionRepository;
            _commentRepository = commentRepository;
        }

        // =========================================================
        // TL-REPORT-001
        // VIEW TEAM PERFORMANCE REPORT
        // =========================================================

        public async Task<TeamPerformanceReportDto>
            GetTeamPerformanceReportAsync(
                Guid teamLeaderId,
                Guid? projectId = null,
                DateTime? startDate = null,
                DateTime? endDate = null)
        {
            // -----------------------------------------------------
            // 1. VALIDATE TEAM LEADER
            // -----------------------------------------------------

            var membership =
                await _reportRepository
                    .GetTeamLeaderMembershipAsync(
                        teamLeaderId);

            if (membership == null)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var teamId =
                membership.TeamId;

            // -----------------------------------------------------
            // 2. GET TEAM
            // -----------------------------------------------------

            var team =
                await _reportRepository
                    .GetTeamWithMembersAsync(teamId);

            if (team == null)
            {
                throw new InvalidOperationException(
                    "Unable to load team performance data. Please try again.");
            }

            // -----------------------------------------------------
            // 3. GET TASKS
            // -----------------------------------------------------

            var tasks =
                projectId.HasValue
                    ? await GetAuthorizedProjectTasksAsync(
                        projectId.Value,
                        teamId)
                    : await _reportRepository
                        .GetTeamTasksAsync(teamId);

            tasks = tasks
                .Where(t => !t.IsDeleted)
                .ToList();

            // -----------------------------------------------------
            // 4. DATE FILTER
            // -----------------------------------------------------

            if (startDate.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.CreatedAt >= startDate.Value)
                    .ToList();
            }

            if (endDate.HasValue)
            {
                var endExclusive =
                    endDate.Value.Date.AddDays(1);

                tasks = tasks
                    .Where(t =>
                        t.CreatedAt < endExclusive)
                    .ToList();
            }

            // -----------------------------------------------------
            // 5. NO DATA
            // -----------------------------------------------------

            if (tasks.Count == 0)
            {
                await RecordReportAccessAsync(
                    teamLeaderId,
                    "TeamPerformanceReport",
                    teamId);

                return new TeamPerformanceReportDto
                {
                    TeamId = teamId,
                    TeamName = team.Name,
                    Contributors = new List<TeamPerformanceMemberDto>(),
                    Success = true,
                    Message =
                        "No team performance data available.",
                    GeneratedAt = DateTime.UtcNow
                };
            }

            // -----------------------------------------------------
            // 6. TEAM TASK METRICS
            // -----------------------------------------------------

            var totalTasks =
                tasks.Count;

            var completedTasks =
                tasks.Count(t =>
                    t.Status ==
                    ProjectTaskStatus.Completed);

            var inProgressTasks =
                tasks.Count(t =>
                    t.Status ==
                    ProjectTaskStatus.InProgress);

            var blockedTasks =
                tasks.Count(t =>
                    t.Status ==
                    ProjectTaskStatus.Blocked);

            var reviewTasks =
                tasks.Count(t =>
                    t.Status ==
                    ProjectTaskStatus.InReview);

            var todoTasks =
                tasks.Count(t =>
                    t.Status ==
                    ProjectTaskStatus.Todo);

            var completionRate =
                totalTasks == 0
                    ? 0
                    : Math.Round(
                        (decimal)completedTasks /
                        totalTasks *
                        100,
                        2);

            // -----------------------------------------------------
            // 7. COMPLETION TIME
            // -----------------------------------------------------

            var completionTimes =
                tasks
                    .Where(t =>
                        t.Status ==
                        ProjectTaskStatus.Completed &&
                        t.UpdatedAt.HasValue)
                    .Select(t =>
                        (t.UpdatedAt!.Value -
                         t.CreatedAt)
                        .TotalHours)
                    .Where(h => h >= 0)
                    .ToList();

            var averageCompletionHours =
                completionTimes.Count == 0
                    ? 0
                    : Math.Round(
                        completionTimes.Average(),
                        2);

            // -----------------------------------------------------
            // 8. WORKLOAD
            // -----------------------------------------------------

            var estimatedHours =
                tasks.Sum(t =>
                    t.EstimatedHours);

            var actualHours =
                tasks.Sum(t =>
                    t.ActualHours);

            // -----------------------------------------------------
            // 9. OVERDUE
            // -----------------------------------------------------

            var now =
                DateTime.UtcNow;

            var overdueTasks =
                tasks.Count(t =>
                    t.Status !=
                    ProjectTaskStatus.Completed &&
                    t.DueDate < now);

            // -----------------------------------------------------
            // 10. TEAM MEMBERS
            // -----------------------------------------------------

            var activeMembers =
                team.TeamMembers
                    .Where(tm =>
                        tm.IsActive &&
                        tm.User != null &&
                        tm.User.IsActive &&
                        !tm.IsTeamLeader)
                    .ToList();

            // -----------------------------------------------------
            // 11. INDIVIDUAL CONTRIBUTIONS
            // -----------------------------------------------------

            var contributors =
                new List<TeamPerformanceMemberDto>();

            foreach (var member in activeMembers)
            {
                var userId =
                    member.UserId;

                var memberTasks =
                    tasks
                        .Where(t =>
                            t.AssignedContributorSDId ==
                            userId)
                        .ToList();

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

                var memberOverdue =
                    memberTasks.Count(t =>
                        t.Status !=
                        ProjectTaskStatus.Completed &&
                        t.DueDate < now);

                var memberCompletionRate =
                    memberTasks.Count == 0
                        ? 0
                        : Math.Round(
                            (decimal)memberCompleted /
                            memberTasks.Count *
                            100,
                            2);

                contributors.Add(
                    new TeamPerformanceMemberDto
                    {
                        UserId =
                            userId,

                        UserName = member.User!.FullName,

                        ContributorTypeId =
                            member.ContributorTypeId,

                        ContributorType =
                            member.ContributorType?.Name
                            ?? string.Empty,

                        ContributorSubTypeId =
                            member.ContributorSubTypeId,

                        ContributorSubType =
                            member.ContributorSubType?.Name,

                        AssignedTasks =
                            memberTasks.Count,

                        CompletedTasks =
                            memberCompleted,

                        BlockedTasks =
                            memberBlocked,

                        CompletionRate =
                            memberCompletionRate,

                        EstimatedHours =
                            memberTasks.Sum(t =>
                                t.EstimatedHours),

                        ActualHours =
                            memberTasks.Sum(t =>
                                t.ActualHours)
                    });
            }

            // -----------------------------------------------------
            // 12. SPRINT CONTRIBUTION
            // -----------------------------------------------------

            var sprintIds =
                tasks
                    .Select(t => t.SprintId)
                    .Distinct()
                    .ToList();

            var sprintContribution =
                new Dictionary<Guid, int>();

            foreach (var sprintId in sprintIds)
            {
                var sprintTasks =
                    tasks
                        .Where(t =>
                            t.SprintId ==
                            sprintId)
                        .ToList();

                sprintContribution[sprintId] =
                    sprintTasks.Count(t =>
                        t.Status ==
                        ProjectTaskStatus.Completed);
            }

            // -----------------------------------------------------
            // 13. COLLABORATION ACTIVITY
            // -----------------------------------------------------

            var activityCount = 0;

            foreach (var task in tasks)
            {
                var activities =
                    await _activityLogService
                        .GetByEntityAsync(task.Id);

                activityCount +=
                    activities.Count;
            }

            // -----------------------------------------------------
            // 14. RECORD ACCESS
            // -----------------------------------------------------

            await RecordReportAccessAsync(
                teamLeaderId,
                "TeamPerformanceReport",
                teamId);

            // -----------------------------------------------------
            // 15. RETURN REPORT
            // -----------------------------------------------------

            return new TeamPerformanceReportDto
            {
                TeamId =
                    teamId,

                TeamName =
                    team.Name,

                TotalTasks =
                    totalTasks,

                CompletedTasks =
                    completedTasks,

                BlockedTasks =
                    blockedTasks,
CompletionRate = completionRate,
TotalEstimatedHours = estimatedHours,

                TotalActualHours = actualHours,

Contributors =
                    contributors,

                GeneratedAt =
                    DateTime.UtcNow,
Message =
                    "Team performance report generated successfully."
            };
        }

        // =========================================================
        // TL-REPORT-002
        // TEAM TASK HISTORY
        // =========================================================

        public async Task<List<TeamLeaderTaskHistoryDto>>
            GetTeamTaskHistoryAsync(
                Guid teamLeaderId,
                Guid? projectId = null,
                Guid? sprintId = null,
                Guid? teamMemberId = null,
                ProjectTaskStatus? status = null,
                DateTime? startDate = null,
                DateTime? endDate = null)
        {
            // -----------------------------------------------------
            // 1. AUTHORIZE TEAM LEADER
            // -----------------------------------------------------

            var membership =
                await _reportRepository
                    .GetTeamLeaderMembershipAsync(
                        teamLeaderId);

            if (membership == null)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var teamId =
                membership.TeamId;

            // -----------------------------------------------------
            // 2. GET TEAM TASKS
            // -----------------------------------------------------

            var tasks =
                projectId.HasValue
                    ? await GetAuthorizedProjectTasksAsync(
                        projectId.Value,
                        teamId)
                    : await _reportRepository
                        .GetTeamTasksAsync(teamId);

            tasks = tasks
                .Where(t => !t.IsDeleted)
                .ToList();

            // -----------------------------------------------------
            // 3. SPRINT FILTER
            // -----------------------------------------------------

            if (sprintId.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.SprintId ==
                        sprintId.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // 4. TEAM MEMBER FILTER
            // -----------------------------------------------------

            if (teamMemberId.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.AssignedContributorSDId ==
                        teamMemberId.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // 5. STATUS FILTER
            // -----------------------------------------------------

            if (status.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.Status ==
                        status.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // 6. DATE FILTER
            // -----------------------------------------------------

            if (startDate.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.CreatedAt >=
                        startDate.Value)
                    .ToList();
            }

            if (endDate.HasValue)
            {
                var endExclusive =
                    endDate.Value.Date.AddDays(1);

                tasks = tasks
                    .Where(t =>
                        t.CreatedAt <
                        endExclusive)
                    .ToList();
            }

            // -----------------------------------------------------
            // 7. BUILD HISTORY
            // -----------------------------------------------------

            var result =
                new List<TeamLeaderTaskHistoryDto>();

            foreach (var task in tasks)
            {
                var sprint =
                    await _sprintRepository
                        .GetByIdAsync(
                            task.SprintId);

                if (sprint == null ||
                    sprint.IsDeleted)
                {
                    continue;
                }

                var assignedMember =
                    task.AssignedContributorSDId.HasValue
                        ? await _userRepository
                            .GetByIdAsync(
                                task.AssignedContributorSDId.Value)
                        : null;

                // -------------------------------------------------
                // SUBMISSIONS
                // -------------------------------------------------

                var submissions =
                    await _submissionRepository
                        .GetByTaskIdAsync(task.Id);

                // -------------------------------------------------
                // COMMENTS
                // -------------------------------------------------

                var comments =
                    await _commentRepository
                        .GetByTaskIdAsync(task.Id);

                // -------------------------------------------------
                // ACTIVITY TIMELINE
                // -------------------------------------------------

                var activities =
                    await _activityLogService
                        .GetByEntityAsync(task.Id);

                // -------------------------------------------------
                // FILE ACTIVITIES
                // -------------------------------------------------

                var fileActivities =
                    activities
                        .Where(a =>
                            string.Equals(
                                a.EntityType,
                                "File",
                                StringComparison.OrdinalIgnoreCase))
                        .ToList();

                // -------------------------------------------------
                // COMPLETION DATE
                // -------------------------------------------------

                DateTime? completionDate = null;

                if (task.Status ==
                    ProjectTaskStatus.Completed)
                {
                    completionDate =
                        task.UpdatedAt;
                }

                // -------------------------------------------------
                // MAP HISTORY
                // -------------------------------------------------

                result.Add(
                    new TeamLeaderTaskHistoryDto
                    {
                        TaskId =
                            task.Id,

                        TaskName =
                            task.Title,

                        SprintId =
                            sprint.Id,

                        SprintName =
                            sprint.Name,

                        AssignedTeamMemberId =
                            task.AssignedContributorSDId,

                        AssignedTeamMemberName =
                            assignedMember?.FullName,

                        Status =
                            task.Status,

                        Priority =
                            task.Priority.ToString(),

                        EstimatedHours =
                            task.EstimatedHours,

                        ActualHours =
                            task.ActualHours,

                        AssignmentDate =
                            task.CreatedAt,

                        CompletionDate =
                            completionDate,

                        DueDate =
                            task.DueDate,

                        WorkSubmissions = submissions.Select(s => new TaskSubmissionDto
{
    Id = s.Id,
    TaskId = s.TaskId,
    SubmittedBy = s.SubmittedBy,
    CompletionNotes = s.CompletionNotes,
    WorkSummary = s.WorkSummary,
    RelatedLinks = s.RelatedLinks,
    SubmittedAt = s.SubmittedAt,
    IsApproved = s.IsApproved,
    IsRejected = s.IsRejected,
    ReviewComment = s.ReviewComment,
    ReviewedAt = s.ReviewedAt,
    ReviewedBy = s.ReviewedBy
}).ToList(),

                        SubmittedWorkCount =
                            submissions.Count,

                        Comments = comments
    .Where(c => !c.IsDeleted)
    .Select(c => new TaskCommentDto
    {
        Id = c.Id,
        TaskId = c.TaskId,
        CreatedBy = c.CreatedBy,
        Content = c.Content,
        CreatedAt = c.CreatedAt,
        UpdatedAt = c.UpdatedAt
    })
    .ToList(),

                        CommentCount =
                            comments.Count(c =>
                                !c.IsDeleted),

                        FileActivities =
                            fileActivities,

                        SubmittedFileCount =
                            fileActivities.Count,

                        ActivityTimeline =
                            activities
                    });
            }

            // -----------------------------------------------------
            // RECORD ACCESS
            // -----------------------------------------------------

            await RecordReportAccessAsync(
                teamLeaderId,
                "TeamTaskHistory",
                teamId);

            return result
                .OrderByDescending(t =>
                    t.AssignmentDate)
                .ToList();
        }

        // =========================================================
        // SINGLE TASK HISTORY
        // =========================================================

        public async Task<TeamLeaderTaskHistoryDto?>
            GetTeamTaskHistoryByIdAsync(
                Guid teamLeaderId,
                Guid taskId)
        {
            var membership =
                await _reportRepository
                    .GetTeamLeaderMembershipAsync(
                        teamLeaderId);

            if (membership == null)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var task =
                await _reportRepository
                    .GetTeamTaskAsync(
                        taskId,
                        membership.TeamId);

            if (task == null)
            {
                return null;
            }

            var sprint =
                await _sprintRepository
                    .GetByIdAsync(
                        task.SprintId);

            if (sprint == null ||
                sprint.IsDeleted)
            {
                return null;
            }

            var assignedMember =
                task.AssignedContributorSDId.HasValue
                    ? await _userRepository
                        .GetByIdAsync(
                            task.AssignedContributorSDId.Value)
                    : null;

            var submissions =
                await _submissionRepository
                    .GetByTaskIdAsync(task.Id);

            var comments =
                await _commentRepository
                    .GetByTaskIdAsync(task.Id);

            var activities =
                await _activityLogService
                    .GetByEntityAsync(task.Id);

            var fileActivities =
                activities
                    .Where(a =>
                        string.Equals(
                            a.EntityType,
                            "File",
                            StringComparison.OrdinalIgnoreCase))
                    .ToList();

            await RecordReportAccessAsync(
                teamLeaderId,
                "TeamTaskHistory",
                membership.TeamId);

            return new TeamLeaderTaskHistoryDto
            {
                TaskId =
                    task.Id,

                TaskName =
                    task.Title,

                SprintId =
                    sprint.Id,

                SprintName =
                    sprint.Name,

                AssignedTeamMemberId =
                    task.AssignedContributorSDId,

                AssignedTeamMemberName =
                    assignedMember?.FullName,

                Status =
                    task.Status,

                Priority =
                    task.Priority.ToString(),

                EstimatedHours =
                    task.EstimatedHours,

                ActualHours =
                    task.ActualHours,

                AssignmentDate =
                    task.CreatedAt,

                CompletionDate =
                    task.Status ==
                    ProjectTaskStatus.Completed
                        ? task.UpdatedAt
                        : null,

                DueDate =
                    task.DueDate,

                WorkSubmissions = submissions.Select(s => new TaskSubmissionDto
{
    Id = s.Id,
    TaskId = s.TaskId,
    SubmittedBy = s.SubmittedBy,
    CompletionNotes = s.CompletionNotes,
    WorkSummary = s.WorkSummary,
    RelatedLinks = s.RelatedLinks,
    SubmittedAt = s.SubmittedAt,
    IsApproved = s.IsApproved,
    IsRejected = s.IsRejected,
    ReviewComment = s.ReviewComment,
    ReviewedAt = s.ReviewedAt,
    ReviewedBy = s.ReviewedBy
}).ToList(),

                SubmittedWorkCount =
                    submissions.Count,

                Comments = comments
    .Where(c => !c.IsDeleted)
    .Select(c => new TaskCommentDto
    {
        Id = c.Id,
        TaskId = c.TaskId,
        CreatedBy = c.CreatedBy,
        Content = c.Content,
        CreatedAt = c.CreatedAt,
        UpdatedAt = c.UpdatedAt
    })
    .ToList(),

                CommentCount =
                    comments.Count(c =>
                        !c.IsDeleted),

                FileActivities =
                    fileActivities,

                SubmittedFileCount =
                    fileActivities.Count,

                ActivityTimeline =
                    activities
            };
        }

        // =========================================================
        // PROJECT AUTHORIZATION
        // =========================================================

        private async Task<List<AI_PMS.Domain.Entities.Tasks.TaskItem>>
            GetAuthorizedProjectTasksAsync(
                Guid projectId,
                Guid teamId)
        {
            var project =
                await _reportRepository
                    .GetProjectForTeamAsync(
                        projectId,
                        teamId);

            if (project == null)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            return await _reportRepository
                .GetProjectTasksAsync(projectId);
        }

        // =========================================================
        // ACTIVITY AUDIT
        // =========================================================

        private async Task RecordReportAccessAsync(
            Guid userId,
            string reportType,
            Guid teamId)
        {
            try
            {
                await _activityLogService.CreateAsync(
                    userId,
                    "ReportViewed",
                    "ReportAccess",
                    teamId,
                    "Team",
                    $"Team Leader viewed {reportType}.");
            }
            catch
            {
                // Report viewing must not fail
                // because audit logging failed.
            }
        }
    }
}









