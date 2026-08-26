using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Sprints
{
    public class SprintBacklogDto
    {
        public Guid SprintId { get; set; }

        public Guid ProjectId { get; set; }

        public string SprintName { get; set; } = string.Empty;

        public string Goal { get; set; } = string.Empty;

        public SprintStatus Status { get; set; }

        public Guid? TeamId { get; set; }

        public int TotalTasks { get; set; }

        public bool HasTasks { get; set; }

        public string? Message { get; set; }

        public List<SprintBacklogTaskDto> Tasks { get; set; }
            = new List<SprintBacklogTaskDto>();
    }

    public class SprintBacklogTaskDto
    {
        public Guid Id { get; set; }

        public Guid SprintId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public Guid? AssignedDeveloperId { get; set; }

        public string? AssignedDeveloperName { get; set; }

        public TaskPriority Priority { get; set; }

        public ProjectTaskStatus Status { get; set; }

        public int EstimatedHours { get; set; }

        public int ActualHours { get; set; }

        public DateTime DueDate { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}