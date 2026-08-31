using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.DTOs.TaskComments;
using AI_PMS.Application.DTOs.TaskSubmissions;
using AI_PMS.Application.Interfaces.Activities;
using  AI_PMS.Application.Interfaces.Repositories.Sprints;
using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Application.Interfaces.Repositories.TaskComments;
using AI_PMS.Application.Interfaces.Repositories.TaskSubmissions;
using AI_PMS.Application.Interfaces.Repositories.Tasks;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Application.Interfaces.Sprints;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Reports
{
    public class ContributorReportService
        : IContributorReportService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITaskRepository _taskRepository;
        private readonly ISprintRepository _sprintRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly ITaskSubmissionRepository _submissionRepository;
        private readonly ITaskCommentRepository _commentRepository;
        private readonly IActivityLogService _activityLogService;

        public ContributorReportService(
            IUserRepository userRepository,
            ITaskRepository taskRepository,
            ISprintRepository sprintRepository,
            IProjectRepository projectRepository,
            ITaskSubmissionRepository submissionRepository,
            ITaskCommentRepository commentRepository,
            IActivityLogService activityLogService)
        {
            _userRepository = userRepository;
            _taskRepository = taskRepository;
            _sprintRepository = sprintRepository;
            _projectRepository = projectRepository;
            _submissionRepository = submissionRepository;
            _commentRepository = commentRepository;
            _activityLogService = activityLogService;
        }

        // =========================================================
        // DEV-REPORT-001
        // STAFF-REPORT-001
        //
        // PERSONAL PERFORMANCE REPORT
        // =========================================================

        public async Task<ContributorPerformanceReportDto>
            GetPersonalPerformanceReportAsync(
                Guid userId,
                DateTime? startDate = null,
                DateTime? endDate = null)
        {
            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null ||
                !user.IsActive ||
                user.Role != Role.Contributor)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // GET CONTRIBUTOR TASKS
            // -----------------------------------------------------

            var tasks =
                await _taskRepository
                    .GetContributorSDTasksAsync(userId);

            // -----------------------------------------------------
            // DATE FILTER
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
            // NO PERFORMANCE DATA
            // -----------------------------------------------------

            if (tasks.Count == 0)
            {
                await RecordReportAccessAsync(
                    userId,
                    "PersonalPerformanceReport");

                return new ContributorPerformanceReportDto
                {
                    UserId = userId,
                    UserName = user.FullName,
                    GeneratedAt = DateTime.UtcNow,
                    HasPerformanceData = false,
                    Message = "No performance data available."
                };
            }

            // -----------------------------------------------------
            // TASK STATUS COUNTS
            // -----------------------------------------------------

            var completedTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Completed);

            var inProgressTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.InProgress);

            var blockedTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.Blocked);

            var reviewTasks =
                tasks.Count(t =>
                    t.Status == ProjectTaskStatus.InReview);

            var completionRate =
                tasks.Count == 0
                    ? 0
                    : Math.Round(
                        (decimal)completedTasks /
                        tasks.Count *
                        100,
                        2);

            // -----------------------------------------------------
            // COMPLETION TIME
            //
            // TaskItem currently does not have a dedicated
            // CompletedAt property.
            //
            // Therefore UpdatedAt is used as the completion
            // timestamp for currently completed tasks.
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
            // WORKLOAD
            // -----------------------------------------------------

            var estimatedHours =
                tasks.Sum(t => t.EstimatedHours);

            var actualHours =
                tasks.Sum(t => t.ActualHours);

            // -----------------------------------------------------
            // OVERDUE / DUE SOON
            // -----------------------------------------------------

            var now = DateTime.UtcNow;

            var overdueTasks =
                tasks.Count(t =>
                    t.Status != ProjectTaskStatus.Completed &&
                    t.DueDate < now);

            var dueSoonTasks =
                tasks.Count(t =>
                    t.Status != ProjectTaskStatus.Completed &&
                    t.DueDate >= now &&
                    t.DueDate <= now.AddDays(3));

            // -----------------------------------------------------
            // SUBMISSIONS + COMMENTS
            // -----------------------------------------------------

            var submittedWorkCount = 0;
            var approvedSubmissionCount = 0;
            var rejectedSubmissionCount = 0;
            var revisionRequestCount = 0;
            var commentCount = 0;

            var sprintIds =
                new HashSet<Guid>();

            foreach (var task in tasks)
            {
                sprintIds.Add(task.SprintId);

                var submissions =
                    await _submissionRepository
                        .GetByTaskIdAsync(task.Id);

                var ownSubmissions =
                    submissions
                        .Where(s =>
                            s.SubmittedBy == userId)
                        .ToList();

                submittedWorkCount +=
                    ownSubmissions.Count;

                approvedSubmissionCount +=
                    ownSubmissions.Count(s =>
                        s.IsApproved);

                rejectedSubmissionCount +=
                    ownSubmissions.Count(s =>
                        s.IsRejected);

                revisionRequestCount +=
                    ownSubmissions.Count(s =>
                        s.IsRejected &&
                        !string.IsNullOrWhiteSpace(
                            s.ReviewComment));

                var comments =
                    await _commentRepository
                        .GetByTaskIdAsync(task.Id);

                commentCount +=
                    comments.Count(c =>
                        c.CreatedBy == userId &&
                        !c.IsDeleted);
            }

            // -----------------------------------------------------
            // ACTIVITY
            // -----------------------------------------------------

            var activities =
                await _activityLogService
                    .GetByUserAsync(userId);

            if (startDate.HasValue)
            {
                activities =
                    activities
                        .Where(a =>
                            a.CreatedAt >=
                            startDate.Value)
                        .ToList();
            }

            if (endDate.HasValue)
            {
                var endExclusive =
                    endDate.Value.Date.AddDays(1);

                activities =
                    activities
                        .Where(a =>
                            a.CreatedAt <
                            endExclusive)
                        .ToList();
            }

            // -----------------------------------------------------
            // SPRINT CONTRIBUTION
            // -----------------------------------------------------

            var sprintTasksCompleted = 0;

            foreach (var sprintId in sprintIds)
            {
                var sprintTasks =
                    await _taskRepository
                        .GetSprintTasksAsync(sprintId);

                sprintTasksCompleted +=
                    sprintTasks.Count(t =>
                        t.AssignedContributorSDId == userId &&
                        t.Status ==
                            ProjectTaskStatus.Completed);
            }

            // -----------------------------------------------------
            // RECORD REPORT ACCESS
            // -----------------------------------------------------

            await RecordReportAccessAsync(
                userId,
                "PersonalPerformanceReport");

            // -----------------------------------------------------
            // RETURN REPORT
            // -----------------------------------------------------

            return new ContributorPerformanceReportDto
            {
                UserId = userId,

                UserName = user.FullName,

                AssignedTasks = tasks.Count,

                CompletedTasks = completedTasks,

                InProgressTasks = inProgressTasks,

                BlockedTasks = blockedTasks,

                TasksUnderReview = reviewTasks,

                TaskCompletionRate = completionRate,

                AverageTaskCompletionTimeHours =
                    averageCompletionHours,

                EstimatedWorkloadHours =
                    estimatedHours,

                ActualWorkHours =
                    actualHours,

                SubmittedWorkCount =
                    submittedWorkCount,

                ApprovedSubmissionCount =
                    approvedSubmissionCount,

                RejectedSubmissionCount =
                    rejectedSubmissionCount,

                ReturnedForModificationCount =
                    revisionRequestCount,

                CommentCount =
                    commentCount,

                ActivityCount =
                    activities.Count,

                OverdueTaskCount =
                    overdueTasks,

                DueSoonTaskCount =
                    dueSoonTasks,

                SprintsContributedTo =
                    sprintIds.Count,

                SprintTasksCompleted =
                    sprintTasksCompleted,

                RecentActivities =
                    activities
                        .Take(20)
                        .ToList(),

                GeneratedAt =
                    DateTime.UtcNow,

                HasPerformanceData = true,

                Message =
                    "Personal performance report generated successfully."
            };
        }

        // =========================================================
        // DEV-REPORT-002
        // STAFF-REPORT-002
        //
        // TASK HISTORY
        // =========================================================

        public async Task<List<ContributorTaskHistoryDto>>
            GetTaskHistoryAsync(
                Guid userId,
                Guid? projectId = null,
                Guid? sprintId = null,
                ProjectTaskStatus? status = null,
                DateTime? startDate = null,
                DateTime? endDate = null)
        {
            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null ||
                !user.IsActive ||
                user.Role != Role.Contributor)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var tasks =
                await _taskRepository
                    .GetContributorSDTasksAsync(userId);

            // -----------------------------------------------------
            // FILTER BY SPRINT
            // -----------------------------------------------------

            if (sprintId.HasValue)
            {
                tasks =
                    tasks
                        .Where(t =>
                            t.SprintId ==
                            sprintId.Value)
                        .ToList();
            }

            // -----------------------------------------------------
            // FILTER BY STATUS
            // -----------------------------------------------------

            if (status.HasValue)
            {
                tasks =
                    tasks
                        .Where(t =>
                            t.Status ==
                            status.Value)
                        .ToList();
            }

            // -----------------------------------------------------
            // DATE FILTER
            // -----------------------------------------------------

            if (startDate.HasValue)
            {
                tasks =
                    tasks
                        .Where(t =>
                            t.CreatedAt >=
                            startDate.Value)
                        .ToList();
            }

            if (endDate.HasValue)
            {
                var endExclusive =
                    endDate.Value.Date.AddDays(1);

                tasks =
                    tasks
                        .Where(t =>
                            t.CreatedAt <
                            endExclusive)
                        .ToList();
            }

            var result =
                new List<ContributorTaskHistoryDto>();

            foreach (var task in tasks)
            {
                var sprint =
                    await _sprintRepository
                        .GetByIdAsync(task.SprintId);

                if (sprint == null)
                    continue;

                var project =
                    await _projectRepository
                        .GetByIdAsync(sprint.ProjectId);

                if (project == null)
                    continue;

                // -------------------------------------------------
                // PROJECT FILTER
                // -------------------------------------------------

                if (projectId.HasValue &&
                    project.Id != projectId.Value)
                {
                    continue;
                }

                // -------------------------------------------------
                // SUBMISSIONS
                // -------------------------------------------------

                var submissions =
                    await _submissionRepository
                        .GetByTaskIdAsync(task.Id);

              var ownSubmissions =
    submissions
        .Where(s =>
            s.SubmittedBy == userId)
        .OrderByDescending(s =>
            s.SubmittedAt)
        .Select(s => new TaskSubmissionDto
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
        })
        .ToList();

                // -------------------------------------------------
                // COMMENTS
                // -------------------------------------------------

                var comments =
                    await _commentRepository
                        .GetByTaskIdAsync(task.Id);

               var ownComments =
    comments
        .Where(c =>
            c.CreatedBy == userId &&
            !c.IsDeleted)
        .OrderByDescending(c =>
            c.CreatedAt)
        .Select(c => new TaskCommentDto
        {
            Id = c.Id,
            TaskId = c.TaskId,
            CreatedBy = c.CreatedBy,
            Content = c.Content,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        })
        .ToList();

                // -------------------------------------------------
                // ACTIVITY TIMELINE
                // -------------------------------------------------

                var activityTimeline =
                    await _activityLogService
                        .GetByEntityAsync(task.Id);

                // -------------------------------------------------
                // FILE ACTIVITIES
                //
                // Uses ActivityLog because no TaskFile entity
                // has been provided in the current implementation.
                // -------------------------------------------------

                var fileActivities =
                    activityTimeline
                        .Where(a =>
                            string.Equals(
                                a.EntityType,
                                "File",
                                StringComparison.OrdinalIgnoreCase))
                        .ToList();

                // -------------------------------------------------
                // COMPLETION DATE
                //
                // TaskItem currently has no CompletedAt.
                // UpdatedAt is therefore used for completed tasks.
                // -------------------------------------------------

                DateTime? completionDate = null;

                if (task.Status ==
                        ProjectTaskStatus.Completed)
                {
                    completionDate =
                        task.UpdatedAt;
                }

                // -------------------------------------------------
                // HISTORY ITEM
                // -------------------------------------------------

                result.Add(
                    new ContributorTaskHistoryDto
                    {
                        TaskId =
                            task.Id,

                        TaskName =
                            task.Title,

                        ProjectId =
                            project.Id,

                        ProjectName =
                            project.Name,

                        SprintId =
                            sprint.Id,

                        SprintName =
                            sprint.Name,

                        Status =
                            task.Status,

                        Priority =
                            task.Priority,

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

                        WorkSubmissions =
                            ownSubmissions,

                        SubmittedWorkCount =
                            ownSubmissions.Count,

                        ApprovedSubmissionCount =
                            ownSubmissions.Count(s =>
                                s.IsApproved),

                        RejectedSubmissionCount =
                            ownSubmissions.Count(s =>
                                s.IsRejected),

                        RevisionRequestCount =
                            ownSubmissions.Count(s =>
                                s.IsRejected &&
                                !string.IsNullOrWhiteSpace(
                                    s.ReviewComment)),

                        Comments =
                            ownComments,

                        CommentCount =
                            ownComments.Count,

                        FileActivities =
                            fileActivities,

                        SubmittedFileCount =
                            fileActivities.Count,

                        ActivityTimeline =
                            activityTimeline
                    });
            }

            // -----------------------------------------------------
            // RECORD REPORT ACCESS
            // -----------------------------------------------------

            await RecordReportAccessAsync(
                userId,
                "TaskHistory");

            return result
                .OrderByDescending(t =>
                    t.AssignmentDate)
                .ToList();
        }

        // =========================================================
        // SINGLE TASK HISTORY
        // =========================================================

        public async Task<ContributorTaskHistoryDto?>
            GetTaskHistoryByIdAsync(
                Guid userId,
                Guid taskId)
        {
            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null ||
                !user.IsActive ||
                user.Role != Role.Contributor)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var task =
                await _taskRepository
                    .GetByIdAsync(taskId);

            if (task == null)
                return null;

            // -----------------------------------------------------
            // CRITICAL SECURITY CHECK
            //
            // Contributor can ONLY view their own task history.
            // -----------------------------------------------------

            if (task.AssignedContributorSDId != userId)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var sprint =
                await _sprintRepository
                    .GetByIdAsync(task.SprintId);

            if (sprint == null)
                return null;

            var project =
                await _projectRepository
                    .GetByIdAsync(sprint.ProjectId);

            if (project == null)
                return null;

            var submissions =
                await _submissionRepository
                    .GetByTaskIdAsync(task.Id);

           var ownSubmissions =
    submissions
        .Where(s =>
            s.SubmittedBy == userId)
        .OrderByDescending(s =>
            s.SubmittedAt)
        .Select(s => new TaskSubmissionDto
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
        })
        .ToList();

            var comments =
                await _commentRepository
                    .GetByTaskIdAsync(task.Id);

            var ownComments =
    comments
        .Where(c =>
            c.CreatedBy == userId &&
            !c.IsDeleted)
        .OrderByDescending(c =>
            c.CreatedAt)
        .Select(c => new TaskCommentDto
        {
            Id = c.Id,
            TaskId = c.TaskId,
            CreatedBy = c.CreatedBy,
            Content = c.Content,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        })
        .ToList();

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
                userId,
                "TaskHistory",
                task.Id);

            return new ContributorTaskHistoryDto
            {
                TaskId =
                    task.Id,

                TaskName =
                    task.Title,

                ProjectId =
                    project.Id,

                ProjectName =
                    project.Name,

                SprintId =
                    sprint.Id,

                SprintName =
                    sprint.Name,

                Status =
                    task.Status,

                Priority =
                    task.Priority,

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

                WorkSubmissions =
                    ownSubmissions,

                SubmittedWorkCount =
                    ownSubmissions.Count,

                ApprovedSubmissionCount =
                    ownSubmissions.Count(s =>
                        s.IsApproved),

                RejectedSubmissionCount =
                    ownSubmissions.Count(s =>
                        s.IsRejected),

                RevisionRequestCount =
                    ownSubmissions.Count(s =>
                        s.IsRejected &&
                        !string.IsNullOrWhiteSpace(
                            s.ReviewComment)),

                Comments =
                    ownComments,

                CommentCount =
                    ownComments.Count,

                FileActivities =
                    fileActivities,

                SubmittedFileCount =
                    fileActivities.Count,

                ActivityTimeline =
                    activities
            };
        }

        // =========================================================
        // REPORT ACCESS AUDIT
        // =========================================================

        private async Task RecordReportAccessAsync(
            Guid userId,
            string reportType,
            Guid? taskId = null)
        {
            await _activityLogService.CreateAsync(
                userId,

                "ReportViewed",

                "ReportAccess",

                taskId,

                "Report",

                $"Contributor viewed {reportType}.");
        }
    }
}
