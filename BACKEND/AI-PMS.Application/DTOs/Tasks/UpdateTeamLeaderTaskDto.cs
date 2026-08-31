using AI_PMS.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Tasks
{
    public class UpdateTeamLeaderTaskDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public TaskPriority Priority { get; set; }

        [Required]
        public Guid AssignedContributorSDId { get; set; }

        [Range(0, int.MaxValue)]
        public int EstimatedHours { get; set; }

        [Required]
        public DateTime DueDate { get; set; }
    }
}