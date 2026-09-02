using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Application.DTOs.TaskComments;
using AI_PMS.Application.DTOs.TaskSubmissions;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Repositories.Projects;
using AI_PMS.Application.Interfaces.Repositories.Reports;
using AI_PMS.Application.Interfaces.Repositories.Sprints;
using AI_PMS.Application.Interfaces.Repositories.TaskComments;
using AI_PMS.Application.Interfaces.Repositories.TaskSubmissions;
using AI_PMS.Application.Interfaces.Reports;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Services.Reports
{
    public class TeamLeaderTaskHistoryService
        : ITeamLeaderTaskHistoryService
    {
        private readonly ITeamLeaderTaskHistoryRepository
            _repository;

        private readonly ISprintRepository
            _sprintRepository;

        private readonly IProjectRepository
            _projectRepository;

        private readonly ITaskSubmissionRepository
            _submissionRepository;

        private readonly ITaskCommentRepository
            _commentRepository;

        private readonly IActivityLogService
            _activityLogService;

        public TeamLeaderTaskHistoryService(
            ITeamLeaderTaskHistoryRepository repository,
            ISprintRepository sprintRepository,
            IProjectRepository projectRepository,
            ITaskSubmissionRepository submissionRepository,
            ITaskCommentRepository commentRepository,
            IActivityLogService activityLogService)
        {
            _repository = repository;
            _sprintRepository = sprintRepository;
            _projectRepository = projectRepository;
            _submissionRepository = submissionRepository;
            _commentRepository = commentRepository;
            _activityLogService = activityLogService;
        }

        // =========================================================
        // TL-REPORT-002
        // TEAM TASK HISTORY
        // =========================================================

        public async Task<List<TeamLeaderTaskHistoryDto>>
            GetTaskHistoryAsync(
                Guid teamLeaderId,
                Guid? teamMemberId = null,
                Guid? projectId = null,
                Guid? sprintId = null,
                ProjectTaskStatus? status = null,
                DateTime? startDate = null,
                DateTime? endDate = null,
                CancellationToken cancellationToken = default)
        {
            // -----------------------------------------------------
            // TEAM LEADER AUTHORIZATION
            // -----------------------------------------------------

            var isTeamLeader =
                await _repository.IsTeamLeaderAsync(
                    teamLeaderId,
                    cancellationToken);

            if (!isTeamLeader)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // GET TEAM
            // -----------------------------------------------------

            var teamId =
                await _repository.GetTeamIdAsync(
                    teamLeaderId,
                    cancellationToken);

            if (!teamId.HasValue)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // GET TEAM TASKS
            // -----------------------------------------------------

            var tasks =
                await _repository.GetTeamTasksAsync(
                    teamId.Value,
                    cancellationToken);

            // -----------------------------------------------------
            // TEAM MEMBER FILTER
            // -----------------------------------------------------

            if (teamMemberId.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.AssignedContributorSDId ==
                        teamMemberId.Value ||
                        t.AssignedContributorSDId ==
                        teamMemberId.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // SPRINT FILTER
            // -----------------------------------------------------

            if (sprintId.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.SprintId == sprintId.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // STATUS FILTER
            // -----------------------------------------------------

            if (status.HasValue)
            {
                tasks = tasks
                    .Where(t =>
                        t.Status == status.Value)
                    .ToList();
            }

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

            var result =
                new List<TeamLeaderTaskHistoryDto>();

            // -----------------------------------------------------
            // BUILD HISTORY
            // -----------------------------------------------------

            foreach (var task in tasks)
            {
                cancellationToken.ThrowIfCancellationRequested();

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

                var submissionDtos =
                    submissions
                        .OrderByDescending(s =>
                            s.SubmittedAt)
                        .Select(s =>
                            new TaskSubmissionDto
                            {
                                Id = s.Id,
                                TaskId = s.TaskId,
                                SubmittedBy = s.SubmittedBy,
                                CompletionNotes =
                                    s.CompletionNotes,
                                WorkSummary =
                                    s.WorkSummary,
                                RelatedLinks =
                                    s.RelatedLinks,
                                SubmittedAt =
                                    s.SubmittedAt,
                                IsApproved =
                                    s.IsApproved,
                                IsRejected =
                                    s.IsRejected,
                                ReviewComment =
                                    s.ReviewComment,
                                ReviewedAt =
                                    s.ReviewedAt,
                                ReviewedBy =
                                    s.ReviewedBy
                            })
                        .ToList();

                // -------------------------------------------------
                // COMMENTS
                // -------------------------------------------------

                var comments =
                    await _commentRepository
                        .GetByTaskIdAsync(task.Id);

                var commentDtos =
                    comments
                        .Where(c => !c.IsDeleted)
                        .OrderByDescending(c =>
                            c.CreatedAt)
                        .Select(c =>
                            new TaskCommentDto
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
                // ASSIGNED MEMBER
                // -------------------------------------------------

                Guid? assignedMemberId = null;

                string? assignedMemberName = null;

                if (task.AssignedContributorSDId.HasValue)
                {
                    assignedMemberId =
                        task.AssignedContributorSDId;
                }
                else if (task.AssignedContributorSDId.HasValue)
                {
                    assignedMemberId =
                        task.AssignedContributorSDId;
                }

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
                // ADD RESULT
                // -------------------------------------------------

                result.Add(
                    new TeamLeaderTaskHistoryDto
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

                        AssignedTeamMemberId =
                            assignedMemberId,

                        AssignedTeamMemberName =
                            assignedMemberName,

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

                        WorkSubmissions =
                            submissionDtos,

                        SubmittedWorkCount =
                            submissionDtos.Count,

                        ApprovedSubmissionCount =
                            submissionDtos.Count(
                                s => s.IsApproved),

                        RejectedSubmissionCount =
                            submissionDtos.Count(
                                s => s.IsRejected),

                        RevisionRequestCount =
                            submissionDtos.Count(
                                s =>
                                    s.IsRejected &&
                                    !string.IsNullOrWhiteSpace(
                                        s.ReviewComment)),

                        Comments =
                            commentDtos,

                        CommentCount =
                            commentDtos.Count,

                        FileActivities =
                            fileActivities,

                        SubmittedFileCount =
                            fileActivities.Count,

                        ActivityTimeline =
                            activities
                    });
            }

            // -----------------------------------------------------
            // AUDIT
            // -----------------------------------------------------

            await RecordReportAccessAsync(
                teamLeaderId);

            return result
                .OrderByDescending(t =>
                    t.AssignmentDate)
                .ToList();
        }

        // =========================================================
        // SINGLE TASK HISTORY
        // =========================================================

        public async Task<TeamLeaderTaskHistoryDto?>
            GetTaskHistoryByIdAsync(
                Guid teamLeaderId,
                Guid taskId,
                CancellationToken cancellationToken = default)
        {
            var isTeamLeader =
                await _repository.IsTeamLeaderAsync(
                    teamLeaderId,
                    cancellationToken);

            if (!isTeamLeader)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            var teamId =
                await _repository.GetTeamIdAsync(
                    teamLeaderId,
                    cancellationToken);

            if (!teamId.HasValue)
            {
                throw new UnauthorizedAccessException(
                    "Access denied.");
            }

            // -----------------------------------------------------
            // SECURITY:
            // TASK MUST BELONG TO TEAM LEADER'S TEAM
            // -----------------------------------------------------

            var task =
                await _repository.GetTeamTaskByIdAsync(
                    teamId.Value,
                    taskId,
                    cancellationToken);

            if (task == null)
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

            var submissionDtos =
                submissions
                    .OrderByDescending(s =>
                        s.SubmittedAt)
                    .Select(s =>
                        new TaskSubmissionDto
                        {
                            Id = s.Id,
                            TaskId = s.TaskId,
                            SubmittedBy = s.SubmittedBy,
                            CompletionNotes =
                                s.CompletionNotes,
                            WorkSummary =
                                s.WorkSummary,
                            RelatedLinks =
                                s.RelatedLinks,
                            SubmittedAt =
                                s.SubmittedAt,
                            IsApproved =
                                s.IsApproved,
                            IsRejected =
                                s.IsRejected,
                            ReviewComment =
                                s.ReviewComment,
                            ReviewedAt =
                                s.ReviewedAt,
                            ReviewedBy =
                                s.ReviewedBy
                        })
                    .ToList();

            var comments =
                await _commentRepository
                    .GetByTaskIdAsync(task.Id);

            var commentDtos =
                comments
                    .Where(c => !c.IsDeleted)
                    .OrderByDescending(c =>
                        c.CreatedAt)
                    .Select(c =>
                        new TaskCommentDto
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
                teamLeaderId,
                task.Id);

            return new TeamLeaderTaskHistoryDto
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

                AssignedTeamMemberId =
                    task.AssignedContributorSDId ??
                    task.AssignedContributorSDId,

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

                WorkSubmissions =
                    submissionDtos,

                SubmittedWorkCount =
                    submissionDtos.Count,

                ApprovedSubmissionCount =
                    submissionDtos.Count(
                        s => s.IsApproved),

                RejectedSubmissionCount =
                    submissionDtos.Count(
                        s => s.IsRejected),

                RevisionRequestCount =
                    submissionDtos.Count(
                        s =>
                            s.IsRejected &&
                            !string.IsNullOrWhiteSpace(
                                s.ReviewComment)),

                Comments =
                    commentDtos,

                CommentCount =
                    commentDtos.Count,

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
            Guid? taskId = null)
        {
            await _activityLogService.CreateAsync(
                userId,
                "ReportViewed",
                "ReportAccess",
                taskId,
                "Report",
                "Team Leader viewed Team Task History.");
        }
    }
}
