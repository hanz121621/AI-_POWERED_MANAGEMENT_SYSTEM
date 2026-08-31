
using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.TaskComments;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.Communication
{
    public class MessageMention
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // PROJECT DISCUSSION MESSAGE
        // =========================================================

        public Guid? MessageId { get; set; }

        public Message? Message { get; set; }

        // =========================================================
        // TASK COMMENT
        // =========================================================

        public Guid? TaskCommentId { get; set; }

        public TaskComment? TaskComment { get; set; }

        // =========================================================
        // MENTIONED USER
        // =========================================================

        [Required]
        public Guid MentionedUserId { get; set; }

        public User? MentionedUser { get; set; }

        // =========================================================
        // CREATED
        // =========================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
