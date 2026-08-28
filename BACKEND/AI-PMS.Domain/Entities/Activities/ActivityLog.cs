using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.Activities
{
    public class ActivityLog
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // USER WHO PERFORMED THE ACTIVITY
        // =========================================================

        [Required]
        public Guid UserId { get; set; }

        // =========================================================
        // PROJECT / TEAM CONTEXT
        // =========================================================

        // Project in which the activity occurred.
        // Nullable because some system activities may not belong
        // to a specific project.
        public Guid? ProjectId { get; set; }

        // Team in which the activity occurred, when applicable.
        public Guid? TeamId { get; set; }

        // =========================================================
        // ACTIVITY
        // =========================================================

        [Required]
        [MaxLength(500)]
        public string Action { get; set; } = string.Empty;

        // Dynamic activity category.
        [MaxLength(100)]
        public string? ActivityType { get; set; }

        // =========================================================
        // AFFECTED ENTITY
        // =========================================================

        public Guid? EntityId { get; set; }

        [MaxLength(100)]
        public string? EntityType { get; set; }

        // =========================================================
        // DESCRIPTION
        // =========================================================

        [MaxLength(2000)]
        public string? Description { get; set; }

        // =========================================================
        // TIMESTAMP
        // =========================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}