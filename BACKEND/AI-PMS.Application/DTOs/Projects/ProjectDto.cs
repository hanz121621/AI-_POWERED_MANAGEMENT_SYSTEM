namespace AI_PMS.Application.DTOs.Projects
{
    public class ProjectDto
    {
        // =========================================================
        // BASIC INFORMATION
        // =========================================================

        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }


        // =========================================================
        // STATUS
        // =========================================================

        public Guid StatusId { get; set; }

        public string StatusName { get; set; } = string.Empty;

        public bool IsStatusActive { get; set; }

        public bool IsCompletedStatus { get; set; }

        public bool IsArchivedStatus { get; set; }

        public bool IsCancelledStatus { get; set; }


        // =========================================================
        // ASSIGNMENT
        // =========================================================

        public Guid? ManagerId { get; set; }

        public string ManagerName { get; set; } = string.Empty;

        public Guid? TeamId { get; set; }
        public Guid? TeamLeaderId { get; set; }

        public string TeamName { get; set; } = string.Empty;


        // =========================================================
        // PRIORITY
        // =========================================================

        public int PriorityId { get; set; }

        public string PriorityName { get; set; } = string.Empty;


        // =========================================================
        // DATES
        // =========================================================

        public DateTime StartDate { get; set; }

        public DateTime Deadline { get; set; }


        // =========================================================
        // MONITORING
        // =========================================================

        public decimal ProgressPercentage { get; set; }

        public int TaskCount { get; set; }

        public int SprintCount { get; set; }


        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime? ArchivedAt { get; set; }


        // =========================================================
        // STATE
        // =========================================================

        public bool IsCompleted { get; set; }

        public bool IsArchived { get; set; }
    }
}