
namespace AI_PMS.Application.DTOs.Communication
{
    public class SendTeamLeaderMessageDto
    {
        public Guid ProjectId { get; set; }

        public string Message { get; set; } = string.Empty;
    }

    public class MessageResponseDto
    {
        public Guid Id { get; set; }

        public Guid SenderId { get; set; }

        public Guid ReceiverId { get; set; }

        public Guid ProjectId { get; set; }

        public Guid TeamId { get; set; }

        public string Message { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}

