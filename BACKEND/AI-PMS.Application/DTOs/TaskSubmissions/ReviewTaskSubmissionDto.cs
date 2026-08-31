using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.TaskSubmissions
{
    public class ReviewTaskSubmissionDto
    {
        [Required]
        public bool Approve { get; set; }

        [MaxLength(2000)]
        public string? ReviewComment { get; set; }
    }
}