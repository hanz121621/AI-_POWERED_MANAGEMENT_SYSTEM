using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Projects
{
    public class UpdateProjectDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        // Status is required when updating
        [Required]
        public Guid StatusId { get; set; }

        // Manager assignment
        public Guid? ManagerId { get; set; }

        // Team assignment
        public Guid? TeamId { get; set; }

        // Team leader assignment
        public Guid? TeamLeaderId { get; set; }

        // Project priority
        [Range(1, 4)]
        public int PriorityId { get; set; } = 2;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime Deadline { get; set; }
    }
}
