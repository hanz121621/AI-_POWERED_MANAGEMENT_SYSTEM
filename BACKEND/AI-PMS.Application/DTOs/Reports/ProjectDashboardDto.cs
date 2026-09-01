namespace AI_PMS.Application.DTOs.Reports
{
    public class ProjectDashboardDto
    {
        // =========================================================
        // PROJECT
        // =========================================================

        public Guid ProjectId { get; set; }

        public string ProjectName { get; set; } = string.Empty;

        public decimal? OverallProjectProgress { get; set; }

        public string ProgressState { get; set; } = "InsufficientData";

        public DateTime? ProjectDeadline { get; set; }

        // =========================================================
        // ACTIVE SPRINT
        // =========================================================

        public Guid? ActiveSprintId { get; set; }

        public string? ActiveSprintName { get; set; }

        public string? ActiveSprintGoal { get; set; }

        public string? ActiveSprintStatus { get; set; }

        public DateTime? SprintStartDate { get; set; }

        public DateTime? SprintEndDate { get; set; }

        public decimal? SprintProgressPercentage { get; set; }

        // =========================================================
        // TASK STATISTICS
        // =========================================================

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int InProgressTasks { get; set; }

        public int InReviewTasks { get; set; }

        public int TodoTasks { get; set; }

        public int BlockedTasks { get; set; }

        public int OverdueTasks { get; set; }

        public int RemainingTasks { get; set; }

        // =========================================================
        // TEAM
        // =========================================================

        public Guid? TeamId { get; set; }

        public string? TeamName { get; set; }

        public decimal? TeamProgressPercentage { get; set; }

        public int TeamAssignedWorkItems { get; set; }

        public int TeamMemberCount { get; set; }

        public int TeamDeveloperCount { get; set; }

        public int TeamStaffCount { get; set; }

        // =========================================================
        // TEAM LEADER
        // =========================================================

        public Guid? TeamLeaderId { get; set; }

        public string? TeamLeaderName { get; set; }

        public int TeamLeaderTasksCreated { get; set; }

        public int TeamLeaderTasksAssigned { get; set; }

        public decimal? TeamLeaderProgressPercentage { get; set; }

        // =========================================================
        // WORKLOAD
        // =========================================================

        public int EstimatedWorkHours { get; set; }

        public int ActualWorkHours { get; set; }

        // =========================================================
        // UPCOMING DEADLINES
        // =========================================================

        public List<ProjectDashboardDeadlineDto> UpcomingDeadlines { get; set; }
            = new();

        // =========================================================
        // PROJECT ACTIVITY
        // =========================================================

        public List<ProjectDashboardActivityDto> RecentActivities { get; set; }
            = new();
    }

    public class ProjectDashboardDeadlineDto
    {
        public Guid Id { get; set; }

        public string Type { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public DateTime Deadline { get; set; }
    }

    public class ProjectDashboardActivityDto
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string Action { get; set; } = string.Empty;

        public string? ActivityType { get; set; }

        public string? EntityType { get; set; }

        public Guid? EntityId { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}