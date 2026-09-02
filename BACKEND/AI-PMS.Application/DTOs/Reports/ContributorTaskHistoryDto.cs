
using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.DTOs.TaskComments;
using AI_PMS.Application.DTOs.TaskSubmissions;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Reports
{
    public class ContributorTaskHistoryDto
    {
        // =========================================================
        // TASK
        // =========================================================

        public Guid TaskId { get; set; }

        public string TaskName { get; set; } = string.Empty;

        public string ProjectName { get; set; } = string.Empty;

        public Guid ProjectId { get; set; }

        public string SprintName { get; set; } = string.Empty;

        public Guid SprintId { get; set; }

        // =========================================================
        // TASK INFORMATION
        // =========================================================

        public ProjectTaskStatus Status { get; set; }

        public TaskPriority Priority { get; set; }

        public int EstimatedHours { get; set; }

        public int ActualHours { get; set; }

        public DateTime AssignmentDate { get; set; }

        public DateTime? CompletionDate { get; set; }

        public DateTime DueDate { get; set; }

        // =========================================================
        // SUBMISSIONS
        // =========================================================

        public List<TaskSubmissionDto> WorkSubmissions { get; set; }
            = new();

        public int SubmittedWorkCount { get; set; }

        public int ApprovedSubmissionCount { get; set; }

        public int RejectedSubmissionCount { get; set; }

        public int RevisionRequestCount { get; set; }

        // =========================================================
        // COMMENTS
        // =========================================================

        public List<TaskCommentDto> Comments { get; set; }
            = new();

        public int CommentCount { get; set; }

        // =========================================================
        // FILE ACTIVITY
        // =========================================================

        public List<ActivityLogDto> FileActivities { get; set; }
            = new();

        public int SubmittedFileCount { get; set; }

        // =========================================================
        // ACTIVITY TIMELINE
        // =========================================================

        public List<ActivityLogDto> ActivityTimeline { get; set; }
            = new();
    }
}