
using AI_PMS.Application.DTOs.Activities;

namespace AI_PMS.Application.DTOs.Reports
{
    public class ContributorPerformanceReportDto
    {
        // =========================================================
        // USER
        // =========================================================

        public Guid UserId { get; set; }

        public string UserName { get; set; } = string.Empty;

        // =========================================================
        // TASK METRICS
        // =========================================================

        public int AssignedTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int InProgressTasks { get; set; }

        public int BlockedTasks { get; set; }

        public int TasksUnderReview { get; set; }

        public decimal TaskCompletionRate { get; set; }

        // =========================================================
        // TIME / PRODUCTIVITY
        // =========================================================

        public double AverageTaskCompletionTimeHours { get; set; }

        public int EstimatedWorkloadHours { get; set; }

        public int ActualWorkHours { get; set; }

        // =========================================================
        // SUBMISSIONS
        // =========================================================

        public int SubmittedWorkCount { get; set; }

        public int ApprovedSubmissionCount { get; set; }

        public int RejectedSubmissionCount { get; set; }

        public int ReturnedForModificationCount { get; set; }

        // =========================================================
        // COLLABORATION
        // =========================================================

        public int CommentCount { get; set; }

        public int ActivityCount { get; set; }

        // =========================================================
        // WORKLOAD
        // =========================================================

        public int OverdueTaskCount { get; set; }

        public int DueSoonTaskCount { get; set; }

        // =========================================================
        // SPRINT CONTRIBUTION
        // =========================================================

        public int SprintsContributedTo { get; set; }

        public int SprintTasksCompleted { get; set; }

        // =========================================================
        // ACTIVITY
        // =========================================================

        public List<ActivityLogDto> RecentActivities { get; set; }
            = new();

        // =========================================================
        // REPORT INFORMATION
        // =========================================================

        public DateTime GeneratedAt { get; set; }

        public bool HasPerformanceData { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}
