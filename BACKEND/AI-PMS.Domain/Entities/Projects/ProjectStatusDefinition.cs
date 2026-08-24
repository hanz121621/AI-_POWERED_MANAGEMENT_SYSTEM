using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.Projects
{
    public class ProjectStatusDefinition
    {
        // =========================================================
        // PRIMARY KEY
        // =========================================================

        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // STATUS INFORMATION
        // =========================================================

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        // =========================================================
        // CONFIGURATION
        // =========================================================

        // Allows administrators to disable a status without
        // deleting existing project records.
     
        public bool IsActive { get; set; } = true;

        // Controls display order.
        public int DisplayOrder { get; set; }

        // Status used when a new project is created.
        public bool IsInitialStatus { get; set; } = false;

        // Status represents an approved project.
        public bool IsApprovedStatus { get; set; } = false;

        // Status represents a rejected project.
        public bool IsRejectedStatus { get; set; } = false;

        // Status represents project completion.
        public bool IsCompletedStatus { get; set; } = false;

        // Status represents an archived project.
        public bool IsArchivedStatus { get; set; } = false;

        // Status represents project cancellation.
        public bool IsCancelledStatus { get; set; } = false;

        // =========================================================
        // AUDIT INFORMATION
        // =========================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // =========================================================
        // RELATIONSHIPS
        // =========================================================

        // Projects currently using this status.
        public ICollection<Project> Projects { get; set; }
            = new List<Project>();

        // Transitions originating from this status.
        public ICollection<ProjectStatusTransition> FromTransitions { get; set; }
            = new List<ProjectStatusTransition>();

        // Transitions going into this status.
        public ICollection<ProjectStatusTransition> ToTransitions { get; set; }
            = new List<ProjectStatusTransition>();
    }
}