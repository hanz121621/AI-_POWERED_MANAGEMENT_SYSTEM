using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Domain.Entities.Projects
{
    public class Project
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        // Database-driven project status
        [Required]
        public Guid StatusId { get; set; }

        // Project manager
        public Guid? ManagerId { get; set; }

        // Assigned team
        public Guid? TeamId { get; set; }

        // Configurable project priority
        public ProjectPriority Priority { get; set; } = ProjectPriority.Medium;

        public DateTime StartDate { get; set; }

        public DateTime Deadline { get; set; }

        [Range(0, 100)]
        public decimal ProgressPercentage { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime? ArchivedAt { get; set; }

        // =========================================================
        // RELATIONSHIPS
        // =========================================================

        public ProjectStatusDefinition Status { get; set; } = null!;

        public ICollection<ProjectStatusTransition> StatusTransitions { get; set; }
            = new List<ProjectStatusTransition>();
    }
}