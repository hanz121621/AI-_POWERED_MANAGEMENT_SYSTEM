using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.Communication
{
    public class MessageMention
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // MESSAGE
        // =========================================================

        [Required]
        public Guid MessageId { get; set; }

        public Message? Message { get; set; }

        // =========================================================
        // MENTIONED USER
        // =========================================================

        [Required]
        public Guid MentionedUserId { get; set; }

        public User? MentionedUser { get; set; }

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}