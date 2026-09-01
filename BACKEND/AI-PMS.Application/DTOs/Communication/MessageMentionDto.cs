namespace AI_PMS.Application.DTOs.Communication
{
    public class MessageMentionDto
    {
        public Guid Id { get; set; }

        public Guid MessageId { get; set; }

        public Guid MentionedUserId { get; set; }

        public string MentionedUserName { get; set; }
            = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}