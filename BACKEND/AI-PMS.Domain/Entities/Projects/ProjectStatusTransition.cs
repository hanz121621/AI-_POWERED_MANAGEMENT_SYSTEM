using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.Projects
{
    public class ProjectStatusTransition
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // STATUS TRANSITION
        // =========================================================

        [Required]
        public Guid FromStatusId { get; set; }

        [Required]
        public Guid ToStatusId { get; set; }

        // =========================================================
        // CONFIGURATION
        // =========================================================

        public bool IsAllowed { get; set; } = true;

        [MaxLength(500)]
        public string? Description { get; set; }

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // =========================================================
        // RELATIONSHIPS
        // =========================================================

        public ProjectStatusDefinition FromStatus { get; set; } = null!;

        public ProjectStatusDefinition ToStatus { get; set; } = null!;
    }
}