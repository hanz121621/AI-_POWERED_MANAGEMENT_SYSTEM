
namespace AI_PMS.Application.DTOs.Teams
{
    public class TeamLeaderWorkMonitoringDto
    {
        // =========================================================
        // TEAM
        // =========================================================

        public Guid TeamId { get; set; }

        public string TeamName { get; set; } = string.Empty;

        // =========================================================
        // TEAM LEADER
        // =========================================================

        public Guid TeamLeaderId { get; set; }

        public string TeamLeaderName { get; set; } = string.Empty;

        public string TeamLeaderEmail { get; set; } = string.Empty;

        // =========================================================
        // PROJECT
        // =========================================================

        public Guid ProjectId { get; set; }

        public string ProjectName { get; set; } = string.Empty;

        // =========================================================
        // ACTIVE SPRINT
        // =========================================================

        public Guid? ActiveSprintId { get; set; }

        public string? ActiveSprintName { get; set; }

        public string? ActiveSprintGoal { get; set; }

        public DateTime? SprintStartDate { get; set; }

        public DateTime? SprintEndDate { get; set; }

        public string? SprintStatus { get; set; }

        // =========================================================
        // TASK COUNTS
        // =========================================================

        public int TasksCreated { get; set; }

        public int TasksAssigned { get; set; }

        public int CompletedTasks { get; set; }

        public int InProgressTasks { get; set; }

        public int BlockedTasks { get; set; }

        public int OverdueTasks { get; set; }

        public int TotalSprintTasks { get; set; }

        // =========================================================
        // WORKLOAD
        // =========================================================

        public int AssignedWorkItems { get; set; }

        public int EstimatedWorkHours { get; set; }

        public int ActualWorkHours { get; set; }

        // =========================================================
        // PROGRESS
        // =========================================================

        public decimal TeamProgressPercentage { get; set; }

        public decimal SprintProgressPercentage { get; set; }
    }
}
