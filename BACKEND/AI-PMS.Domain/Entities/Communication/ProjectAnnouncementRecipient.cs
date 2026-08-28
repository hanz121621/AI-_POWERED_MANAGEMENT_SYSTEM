using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.Communication
{
    public class ProjectAnnouncementRecipient
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // ANNOUNCEMENT
        // =========================================================

        [Required]
        public Guid AnnouncementId { get; set; }

        public ProjectAnnouncement? Announcement { get; set; }

        // =========================================================
        // RECIPIENT
        // =========================================================

        [Required]
        public Guid RecipientUserId { get; set; }

        public User? RecipientUser { get; set; }

        // =========================================================
        // DELIVERY
        // =========================================================

        public bool NotificationSent { get; set; }

        public DateTime? NotificationSentAt { get; set; }

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}