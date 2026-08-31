using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Projects
{
    public class CreateProjectDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        // Optional.
        // If omitted, the configured initial status is used.
        public Guid? StatusId { get; set; }

        // Optional manager assignment
        public Guid? ManagerId { get; set; }

        // Optional team assignment
        public Guid? TeamId { get; set; }

        // Project priority
        [Range(1, 4)]
        public int PriorityId { get; set; } = 2;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime Deadline { get; set; }
    }
}
