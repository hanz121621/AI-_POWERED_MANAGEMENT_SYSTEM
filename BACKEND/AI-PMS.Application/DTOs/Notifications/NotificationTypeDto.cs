namespace AI_PMS.Application.DTOs.Notifications
{
    public class NotificationTypeDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }
    }
}