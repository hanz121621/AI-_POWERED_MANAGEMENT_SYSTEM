using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Reports
{
    public class SprintProgressDto
    {
        public Guid SprintId { get; set; }

        public Guid ProjectId { get; set; }

        public string SprintName { get; set; } = string.Empty;

        public string Goal { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public SprintStatus SprintStatus { get; set; }

        public string SprintStatusName =>
            SprintStatus.ToString();

        // =========================================================
        // TASK STATISTICS
        // =========================================================

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int InProgressTasks { get; set; }

        public int PendingTasks { get; set; }

        public int BlockedTasks { get; set; }

        public int OverdueTasks { get; set; }

        // =========================================================
        // CALCULATED PROGRESS
        // =========================================================

        public decimal CompletionPercentage { get; set; }

        public DateTime GeneratedAt { get; set; }
    }
}
