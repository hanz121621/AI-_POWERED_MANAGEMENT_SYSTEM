using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Sprints
{
    public class SprintDto
    {
        public Guid Id { get; set; }

        public Guid ProjectId { get; set; }

        public Guid CreatedBy { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Goal { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public SprintStatus Status { get; set; }

        public SprintPriority Priority { get; set; }

        // =========================================================
        // TEAM
        // =========================================================

        public Guid? TeamId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
