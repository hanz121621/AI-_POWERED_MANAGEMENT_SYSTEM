using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.Notifications
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // RECIPIENT
        // =========================================================

        [Required]
        public Guid UserId { get; set; }

        public User? User { get; set; }

        // =========================================================
        // NOTIFICATION TYPE
        // =========================================================

        [Required]
        public Guid NotificationTypeId { get; set; }

        public NotificationType? NotificationType { get; set; }

        // =========================================================
        // CONTENT
        // =========================================================

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Message { get; set; } = string.Empty;

        // =========================================================
        // READ STATUS
        // =========================================================

        public bool IsRead { get; set; } = false;

        public DateTime? ReadAt { get; set; }

        // =========================================================
        // RELATED PROJECT
        // =========================================================

        public Guid? ProjectId { get; set; }

        public Project? Project { get; set; }

        // =========================================================
        // RELATED TEAM
        // =========================================================

        public Guid? TeamId { get; set; }

        // =========================================================
        // RELATED SPRINT
        // =========================================================

        public Guid? SprintId { get; set; }

        // =========================================================
        // RELATED ACTIVITY / ENTITY
        // =========================================================

        public Guid? RelatedEntityId { get; set; }

        [MaxLength(100)]
        public string? RelatedEntityType { get; set; }

        // =========================================================
        // CREATED
        // =========================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}