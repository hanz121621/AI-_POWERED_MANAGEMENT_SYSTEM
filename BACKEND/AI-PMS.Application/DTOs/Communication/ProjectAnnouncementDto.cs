namespace AI_PMS.Application.DTOs.Communication
{
    public class ProjectAnnouncementDto
    {
        public Guid Id { get; set; }

        public Guid ProjectId { get; set; }

        public Guid? TeamId { get; set; }

        public Guid SenderId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public Guid PriorityId { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<Guid> RecipientUserIds { get; set; }
            = new List<Guid>();
    }
}
