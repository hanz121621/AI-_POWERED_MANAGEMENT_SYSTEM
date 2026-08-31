namespace AI_PMS.Application.DTOs.Activities
{
    public class AuditLogDto
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string Action { get; set; } = string.Empty;

        public string? EntityType { get; set; }

        public Guid? EntityId { get; set; }

        public string? Description { get; set; }

        public string? IpAddress { get; set; }

        public string? UserAgent { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
