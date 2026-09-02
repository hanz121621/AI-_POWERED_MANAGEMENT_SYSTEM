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

        // =========================================================
        // PROJECT STATUS
        // =========================================================

        // Database-driven project status
        [Required]
        public Guid StatusId { get; set; }

        // =========================================================
        // PROJECT ASSIGNMENT
        // =========================================================

      // Project manager
public Guid? ManagerId { get; set; }

// Assigned team
public Guid? TeamId { get; set; }

// Team leader selected for this project
public Guid? TeamLeaderId { get; set; }

        // =========================================================
        // PROJECT PRIORITY
        // =========================================================

        // Configurable project priority
        public ProjectPriority Priority { get; set; }
            = ProjectPriority.Medium;

        // =========================================================
        // PROJECT TIMELINE
        // =========================================================

        public DateTime StartDate { get; set; }

        public DateTime Deadline { get; set; }
        // =========================================================
        // PROJECT PROGRESS
        // =========================================================

        [Range(0, 100)]
        public decimal ProgressPercentage { get; set; } = 0;

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime? ArchivedAt { get; set; }

        public bool IsDeleted { get; set; } = false;

        public DateTime? DeletedAt { get; set; }

        // =========================================================
        // RELATIONSHIPS
        // =========================================================

        // Project -> Status
        public ProjectStatusDefinition Status { get; set; }
            = null!;

        // Project -> Specification
        // One Project has one Specification
        public ProjectSpecification? Specification { get; set; }

        
    }
}