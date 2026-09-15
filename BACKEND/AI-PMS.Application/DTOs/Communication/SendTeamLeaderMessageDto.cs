namespace AI_PMS.Application.DTOs.Communication
{
    public class SendTeamLeaderMessageDto
    {
        public Guid ProjectId { get; set; }

        public Guid? TaskId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;
    }

    public class SendTeamMemberMessageDto
    {
        public Guid ProjectId { get; set; }

        public Guid? TaskId { get; set; }

        public Guid ReceiverId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;
    }

    public class MessageResponseDto
    {
        public Guid Id { get; set; }

        public Guid SenderId { get; set; }

        public string SenderName { get; set; } = string.Empty;

        public Guid ReceiverId { get; set; }

        public string ReceiverName { get; set; } = string.Empty;

        public Guid ProjectId { get; set; }

        public Guid TeamId { get; set; }

        public Guid? TaskId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public bool IsRead { get; set; }

        public DateTime? ReadAt { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}