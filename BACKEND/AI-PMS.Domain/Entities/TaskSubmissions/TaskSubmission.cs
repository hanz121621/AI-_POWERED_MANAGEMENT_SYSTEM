using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.TaskSubmissions
{
    public class TaskSubmission
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TaskId { get; set; }

        [Required]
        public Guid SubmittedBy { get; set; }

        [Required]
        [MaxLength(2000)]
        public string CompletionNotes { get; set; } = string.Empty;

        [Required]
        [MaxLength(5000)]
        public string WorkSummary { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? RelatedLinks { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        public bool IsApproved { get; set; } = false;

        public bool IsRejected { get; set; } = false;

        [MaxLength(2000)]
        public string? ReviewComment { get; set; }

        public DateTime? ReviewedAt { get; set; }

        public Guid? ReviewedBy { get; set; }
    }
}