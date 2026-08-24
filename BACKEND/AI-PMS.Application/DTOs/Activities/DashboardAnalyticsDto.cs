namespace AI_PMS.Application.DTOs.Activities
{
    public class DashboardAnalyticsDto
    {
        // =========================================================
        // USERS
        // =========================================================

        public int TotalUsers { get; set; }

        public int ActiveUsers { get; set; }

        public int InactiveUsers { get; set; }


        // =========================================================
        // PROJECTS
        // =========================================================

        public int TotalProjects { get; set; }

        public int ActiveProjects { get; set; }

        public int CompletedProjects { get; set; }

        public int ArchivedProjects { get; set; }


        // =========================================================
        // TEAMS
        // =========================================================

        public int TotalTeams { get; set; }

        public int ActiveTeamMembers { get; set; }


        // =========================================================
        // TASKS
        // =========================================================

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int InProgressTasks { get; set; }

        public int TodoTasks { get; set; }

        public int BlockedTasks { get; set; }

        public decimal TaskCompletionPercentage { get; set; }


        // =========================================================
        // PROJECT STATUS
        // =========================================================

        public List<ProjectStatusAnalyticsDto> ProjectStatuses { get; set; }
            = new();


        // =========================================================
        // REPORT INFORMATION
        // =========================================================

        public DateTime GeneratedAt { get; set; }

        public bool Success { get; set; }

        public string Message { get; set; } = string.Empty;
    }


    public class ProjectStatusAnalyticsDto
    {
        public Guid StatusId { get; set; }

        public string StatusName { get; set; } = string.Empty;

        public int Count { get; set; }
    }
}