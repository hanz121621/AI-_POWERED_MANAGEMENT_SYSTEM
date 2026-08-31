namespace AI_PMS.Application.DTOs.Sprints
{
    public class SprintProgressDto
    {
        public Guid SprintId { get; set; }

        public Guid ProjectId { get; set; }

        public string SprintName { get; set; } = string.Empty;

        public string Goal { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public Guid? TeamId { get; set; }

        // =========================================================
        // TASK PROGRESS
        // =========================================================

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int InProgressTasks { get; set; }

        public int PendingTasks { get; set; }

        public int InReviewTasks { get; set; }

        public int BlockedTasks { get; set; }

        public int OverdueTasks { get; set; }

        public double CompletionPercentage { get; set; }

        // =========================================================
        // TEAM PROGRESS
        // =========================================================

        public double TeamProgressPercentage { get; set; }

        // =========================================================
        // TEAM LEADER
        // =========================================================

        public Guid? TeamLeaderId { get; set; }

        public string? TeamLeaderName { get; set; }

        public double TeamLeaderProgressPercentage { get; set; }

        // =========================================================
        // EMPTY STATE
        // =========================================================

        public bool HasTasks { get; set; }

        public string? Message { get; set; }
    }
}
