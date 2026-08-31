using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Teams
{
    public class TeamLeaderSprintProgressDto
    {
        public Guid SprintId { get; set; }

        public Guid ProjectId { get; set; }

        public string SprintName { get; set; } = string.Empty;

        public string? Goal { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public SprintStatus Status { get; set; }

        public Guid? TeamId { get; set; }

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int RemainingTasks { get; set; }

        public int InProgressTasks { get; set; }

        public int BlockedTasks { get; set; }

        public int TodoTasks { get; set; }

        public int ReviewTasks { get; set; }

        public double CompletionPercentage { get; set; }

        public int TotalEstimatedHours { get; set; }

        public int TotalActualHours { get; set; }

        public int AssignedTaskCount { get; set; }

        public int UnassignedTaskCount { get; set; }

        public string? Message { get; set; }
    }
}