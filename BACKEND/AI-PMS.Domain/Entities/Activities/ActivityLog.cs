using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.Activities
{
    public class ActivityLog
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // User who performed the activity
        [Required]
        public Guid UserId { get; set; }

        // Dynamic action performed
        [Required]
        [MaxLength(500)]
        public string Action { get; set; } = string.Empty;

        // Dynamic activity category
        [MaxLength(100)]
        public string? ActivityType { get; set; }

        // ID of the affected record, when applicable
        public Guid? EntityId { get; set; }

        // Name/type of the affected entity
        [MaxLength(100)]
        public string? EntityType { get; set; }

        // Additional dynamic information
        [MaxLength(2000)]
        public string? Description { get; set; }

        // Activity time
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}