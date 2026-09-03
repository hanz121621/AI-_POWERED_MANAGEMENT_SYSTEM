using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.SubTasks
{
    public class SubTaskDto
    {
        public Guid Id { get; set; }

        public Guid TaskId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int EstimatedHours { get; set; }

        public bool IsAIGenerated { get; set; }

        // Kept for database compatibility.
        // It is NOT used as an approval workflow.
        public bool IsApproved { get; set; }

        public ProjectTaskStatus Status { get; set; }

        public int Progress { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}