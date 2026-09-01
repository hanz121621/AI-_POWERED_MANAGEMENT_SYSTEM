
namespace AI_PMS.Application.DTOs.Teams
{
    public class TeamProgressDto
    {
        // =========================================================
        // TEAM
        // =========================================================

        public Guid TeamId { get; set; }

        public string TeamName { get; set; } = string.Empty;

        public Guid ProjectId { get; set; }

        public string ProjectName { get; set; } = string.Empty;


        // =========================================================
        // TEAM LEADER
        // =========================================================

        public Guid? TeamLeaderId { get; set; }

        public string? TeamLeaderName { get; set; }


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

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int RemainingTasks { get; set; }

        public int BlockedTasks { get; set; }

        public int OverdueTasks { get; set; }


        // =========================================================
        // PROGRESS
        // Nullable because insufficient data must not become
        // a fake 0% value.
        // =========================================================

        public decimal? TeamCompletionPercentage { get; set; }

        public decimal? SprintProgressPercentage { get; set; }

        public decimal? TeamLeaderProgressPercentage { get; set; }


        // =========================================================
        // WORKLOAD
        // =========================================================

        public int AssignedWorkItems { get; set; }

        public int EstimatedWorkHours { get; set; }

        public int ActualWorkHours { get; set; }


        // =========================================================
        // DATA AVAILABILITY
        // =========================================================

        public bool HasSprintData { get; set; }

        public bool HasTaskData { get; set; }

        public bool HasTeamLeaderData { get; set; }

        public string? DataMessage { get; set; }
    }
}
