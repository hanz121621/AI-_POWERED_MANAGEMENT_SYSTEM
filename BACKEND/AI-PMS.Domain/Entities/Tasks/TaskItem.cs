using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Domain.Entities.Tasks
{
    public class TaskItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid SprintId { get; set; }

        [Required]
        public Guid CreatedBy { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

       public Guid? AssignedContributorSDId { get; set; }

        public TaskPriority Priority { get; set; }
            = TaskPriority.Medium;

        public ProjectTaskStatus Status { get; set; } 
           = ProjectTaskStatus.Todo;

        public int EstimatedHours { get; set; }

        public int ActualHours { get; set; }

        public DateTime DueDate { get; set; }

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}

