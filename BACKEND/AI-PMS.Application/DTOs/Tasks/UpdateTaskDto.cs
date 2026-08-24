using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Tasks
{
    public class UpdateTaskDto
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public Guid? AssignedDeveloperId { get; set; }

        public TaskPriority Priority { get; set; }

        public ProjectTaskStatus Status { get; set; }

        public int EstimatedHours { get; set; }

        public int ActualHours { get; set; }

        public DateTime DueDate { get; set; }
    }
}