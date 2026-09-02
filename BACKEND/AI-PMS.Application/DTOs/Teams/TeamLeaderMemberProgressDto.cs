namespace AI_PMS.Application.DTOs.Teams
{
    public class TeamLeaderMemberProgressDto
    {
        public Guid UserId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int RemainingTasks { get; set; }

        public int InProgressTasks { get; set; }

        public int BlockedTasks { get; set; }

        public double CompletionPercentage { get; set; }

        public int EstimatedHours { get; set; }

        public int ActualHours { get; set; }
    }
}