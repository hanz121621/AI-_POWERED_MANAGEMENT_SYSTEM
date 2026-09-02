namespace AI_PMS.Application.DTOs.TaskSubmissions
{
    public class TaskSubmissionDto
    {
        public Guid Id { get; set; }

        public Guid TaskId { get; set; }

        public Guid SubmittedBy { get; set; }

        public string CompletionNotes { get; set; } = string.Empty;

        public string WorkSummary { get; set; } = string.Empty;

        public string? RelatedLinks { get; set; }

        public DateTime SubmittedAt { get; set; }

        public bool IsApproved { get; set; }

        public bool IsRejected { get; set; }

        public string? ReviewComment { get; set; }

        public DateTime? ReviewedAt { get; set; }

        public Guid? ReviewedBy { get; set; }
    }
}