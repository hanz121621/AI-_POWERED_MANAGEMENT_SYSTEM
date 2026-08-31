namespace AI_PMS.Application.DTOs.Activities
{
    public class SystemReportDto
    {
        // =========================================================
        // USER STATISTICS
        // =========================================================

        public int TotalUsers { get; set; }

        public int ActiveUsers { get; set; }

        public int InactiveUsers { get; set; }


        // =========================================================
        // PROJECT STATISTICS
        // =========================================================

        public int TotalProjects { get; set; }

        public int ActiveProjects { get; set; }

        public int ArchivedProjects { get; set; }

        public int CompletedProjects { get; set; }


        // =========================================================
        // TEAM STATISTICS
        // =========================================================

        public int TotalTeams { get; set; }

        public int ActiveTeamMembers { get; set; }


        // =========================================================
        // TASK STATISTICS
        // =========================================================

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int InProgressTasks { get; set; }

        public int TodoTasks { get; set; }

        public int PendingTasks { get; set; }

        public int BlockedTasks { get; set; }

        public decimal TaskCompletionPercentage { get; set; }


        // =========================================================
        // PROJECT STATUS SUMMARY
        // =========================================================

        public List<ProjectStatusReportDto> ProjectStatusSummary { get; set; }
            = new();


        // =========================================================
        // ACTIVITY STATISTICS
        // =========================================================

        public int TotalActivities { get; set; }

        public int ActiveUsersWithActivity { get; set; }


        // =========================================================
        // AI STATISTICS
        // =========================================================

        public int TotalAIUsage { get; set; }


        // =========================================================
        // INFORMATION ABOUT CURRENT REPORT
        // =========================================================

        public DateTime GeneratedAt { get; set; }

        public string? Message { get; set; }

        public bool Success { get; set; }


        // =========================================================
        // FEATURE AVAILABILITY
        // =========================================================

        public bool ActivityLogAvailable { get; set; }

        public bool AIUsageAvailable { get; set; }
    }


    // =============================================================
    // PROJECT STATUS REPORT
    // =============================================================

    public class ProjectStatusReportDto
    {
        public Guid StatusId { get; set; }

        public string StatusName { get; set; } = string.Empty;

        public int ProjectCount { get; set; }
    }
}
