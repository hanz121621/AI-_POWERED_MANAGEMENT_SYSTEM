using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.TaskSubmissions
{
    public class CreateTaskSubmissionDto
    {
        [Required]
        [MaxLength(2000)]
        public string CompletionNotes { get; set; } = string.Empty;

        [Required]
        [MaxLength(5000)]
        public string WorkSummary { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? RelatedLinks { get; set; }
    }
}