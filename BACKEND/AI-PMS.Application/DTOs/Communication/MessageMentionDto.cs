
namespace AI_PMS.Application.DTOs.Communication
{
    public class MessageMentionDto
    {
        public Guid Id { get; set; }

        // =========================================================
        // MESSAGE
        // =========================================================

        public Guid? MessageId { get; set; }

        // =========================================================
        // TASK COMMENT
        // =========================================================

        public Guid? TaskCommentId { get; set; }

        // =========================================================
        // MENTIONED USER
        // =========================================================

        public Guid MentionedUserId { get; set; }

        public string MentionedUserName { get; set; }
            = string.Empty;

        // =========================================================
        // CREATED
        // =========================================================

        public DateTime CreatedAt { get; set; }
    }
}
