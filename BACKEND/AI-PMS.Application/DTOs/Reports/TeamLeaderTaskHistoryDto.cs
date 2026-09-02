using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.DTOs.TaskComments;
using AI_PMS.Application.DTOs.TaskSubmissions;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Reports
{
    public class TeamLeaderTaskHistoryDto
    {
        public Guid TaskId { get; set; }

        public string TaskName { get; set; } = string.Empty;

        public Guid ProjectId { get; set; }

        public string ProjectName { get; set; } = string.Empty;

        public Guid SprintId { get; set; }

        public string SprintName { get; set; } = string.Empty;

        public Guid? AssignedTeamMemberId { get; set; }

        public string? AssignedTeamMemberName { get; set; }

        public ProjectTaskStatus Status { get; set; }

        public string StatusName =>
            Status.ToString();

        public string? Priority { get; set; }

        public decimal EstimatedHours { get; set; }

        public decimal ActualHours { get; set; }

        public DateTime AssignmentDate { get; set; }

        public DateTime? CompletionDate { get; set; }

        public DateTime DueDate { get; set; }

        public List<TaskSubmissionDto> WorkSubmissions { get; set; }
            = new();

        public int SubmittedWorkCount { get; set; }

        public int ApprovedSubmissionCount { get; set; }

        public int RejectedSubmissionCount { get; set; }

        public int RevisionRequestCount { get; set; }

        public List<TaskCommentDto> Comments { get; set; }
            = new();

        public int CommentCount { get; set; }

        public List<ActivityLogDto> FileActivities { get; set; }
            = new();

        public int SubmittedFileCount { get; set; }

        public List<ActivityLogDto> ActivityTimeline { get; set; }
            = new();
    }
}