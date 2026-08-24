using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Tasks
{
    public class CreateTaskDto
    {
        [Required]
        public Guid SprintId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public Guid? AssignedDeveloperId { get; set; }

        public TaskPriority Priority { get; set; }
            = TaskPriority.Medium;

        [Range(0, int.MaxValue)]
        public int EstimatedHours { get; set; }

        [Required]
        public DateTime DueDate { get; set; }
    }
}