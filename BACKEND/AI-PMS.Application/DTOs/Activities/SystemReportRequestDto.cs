namespace AI_PMS.Application.DTOs.Activities
{
    public class SystemReportRequestDto
    {
        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public Guid? ProjectId { get; set; }

        public Guid? TeamId { get; set; }

        public Guid? UserId { get; set; }
    }
}