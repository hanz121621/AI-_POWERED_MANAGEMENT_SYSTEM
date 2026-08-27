namespace AI_PMS.Application.DTOs.Notifications
{
    public class NotificationDto
    {
        public Guid Id { get; set; }

        // =========================================================
        // RECIPIENT
        // =========================================================

        public Guid UserId { get; set; }

        // =========================================================
        // TYPE
        // =========================================================

        public Guid NotificationTypeId { get; set; }

        public string NotificationTypeName { get; set; }
            = string.Empty;

        // =========================================================
        // CONTENT
        // =========================================================

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        // =========================================================
        // READ STATUS
        // =========================================================

        public bool IsRead { get; set; }

        public DateTime? ReadAt { get; set; }

        // =========================================================
        // RELATED DATA
        // =========================================================

        public Guid? ProjectId { get; set; }

        public string? ProjectName { get; set; }

        public Guid? TeamId { get; set; }

        public Guid? SprintId { get; set; }

        public Guid? RelatedEntityId { get; set; }

        public string? RelatedEntityType { get; set; }

        // =========================================================
        // DATE
        // =========================================================

        public DateTime CreatedAt { get; set; }
    }
}