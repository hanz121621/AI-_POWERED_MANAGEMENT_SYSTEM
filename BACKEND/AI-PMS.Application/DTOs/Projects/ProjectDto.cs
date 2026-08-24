namespace AI_PMS.Application.DTOs.Projects
{
    public class ProjectDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        // Database-driven status
        public Guid StatusId { get; set; }

        public string StatusName { get; set; } = string.Empty;

        public bool IsStatusActive { get; set; }

        public bool IsCompletedStatus { get; set; }

        public bool IsArchivedStatus { get; set; }

        public bool IsCancelledStatus { get; set; }

        // Assignment
        public Guid? ManagerId { get; set; }

        public Guid? TeamId { get; set; }

        // Project priority
        public int PriorityId { get; set; }

        public string PriorityName { get; set; } = string.Empty;

        // Dates
        public DateTime StartDate { get; set; }

        public DateTime Deadline { get; set; }

        // Monitoring
        public decimal ProgressPercentage { get; set; }

        public int TaskCount { get; set; }

        public int SprintCount { get; set; }

        // Audit
        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime? ArchivedAt { get; set; }

        public bool IsCompleted { get; set; }

        public bool IsArchived { get; set; }
    }
}