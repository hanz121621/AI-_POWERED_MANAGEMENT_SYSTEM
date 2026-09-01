
namespace AI_PMS.Application.DTOs.Reports
{
    public class ProjectTimelineDto
    {
        public Guid ProjectId { get; set; }

        public string ProjectName { get; set; } = string.Empty;

        // =========================================================
        // PROJECT TIMELINE
        // =========================================================

        public DateTime ProjectStartDate { get; set; }

        public DateTime ProjectDeadline { get; set; }

        public decimal CurrentProgressPercentage { get; set; }

        // =========================================================
        // MILESTONES
        // =========================================================

        public bool MilestonesAvailable { get; set; }

        public string MilestoneStatus { get; set; } = string.Empty;

        public List<ProjectTimelineMilestoneDto> Milestones { get; set; }
            = new();

        // =========================================================
        // SPRINTS
        // =========================================================

        public List<ProjectTimelineSprintDto> Sprints { get; set; }
            = new();

        // =========================================================
        // OVERDUE SCHEDULE ITEMS
        // =========================================================

        public List<ProjectTimelineOverdueItemDto> OverdueItems { get; set; }
            = new();

        public int OverdueItemCount { get; set; }
    }

    public class ProjectTimelineMilestoneDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }

        public string Status { get; set; } = string.Empty;
    }

    public class ProjectTimelineSprintDto
    {
        public Guid SprintId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Goal { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Status { get; set; } = string.Empty;

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int RemainingTasks { get; set; }

        public decimal ProgressPercentage { get; set; }

        public bool IsCurrent { get; set; }
    }

    public class ProjectTimelineOverdueItemDto
    {
        public Guid Id { get; set; }

        public string ItemType { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public DateTime Deadline { get; set; }

        public string Status { get; set; } = string.Empty;
    }
}
