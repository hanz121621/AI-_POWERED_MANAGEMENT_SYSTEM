namespace AI_PMS.Application.DTOs.Activities
{
    public class ActivityFeedFilterDto
    {
        public Guid? ProjectId { get; set; }

        public Guid? TeamId { get; set; }

        public string? ActivityType { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
