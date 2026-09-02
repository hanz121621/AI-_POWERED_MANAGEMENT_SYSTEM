using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Projects
{
    public class UpdateProjectDeadlineDto
    {
        [Required]
        public DateTime Deadline { get; set; }

        [MaxLength(2000)]
        public string? Reason { get; set; }

        public List<DeadlineMilestoneDto>? Milestones { get; set; }
    }

    public class DeadlineMilestoneDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public DateTime Date { get; set; }
    }
}
