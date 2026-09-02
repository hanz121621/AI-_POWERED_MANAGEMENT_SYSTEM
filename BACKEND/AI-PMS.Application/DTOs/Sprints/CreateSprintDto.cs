using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Sprints
{
    public class CreateSprintDto
    {
        public Guid ProjectId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Goal { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public SprintPriority Priority { get; set; }
            = SprintPriority.Medium;
    }
}
