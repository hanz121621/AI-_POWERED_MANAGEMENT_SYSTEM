namespace AI_PMS.Application.DTOs.Activities
{
    public class ActivityLogDto
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string UserName { get; set; } = string.Empty;

        public Guid? ProjectId { get; set; }

        public Guid? TeamId { get; set; }

        public string Action { get; set; } = string.Empty;

        public string? ActivityType { get; set; }

        public Guid? EntityId { get; set; }

        public string? EntityType { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}