using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Teams
{
    public class TeamLeaderSprintTasksDto
    {
        public Guid SprintId { get; set; }

        public Guid ProjectId { get; set; }

        public string SprintName { get; set; } = string.Empty;

        public string? Goal { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public SprintStatus Status { get; set; }

        public Guid? TeamId { get; set; }

        public int TotalTasks { get; set; }

        public int CompletedTasks { get; set; }

        public int RemainingTasks { get; set; }

        public int InProgressTasks { get; set; }

        public int BlockedTasks { get; set; }

        public double ProgressPercentage { get; set; }

        public bool HasTasks { get; set; }

        public string? Message { get; set; }

        public List<TeamLeaderSprintTaskDto> Tasks { get; set; }
            = new();
    }

    public class TeamLeaderSprintTaskDto
    {
        public Guid Id { get; set; }

        public Guid SprintId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public Guid? AssignedContributorSDId { get; set; }

        public string? AssignedDeveloperName { get; set; }

        public TaskPriority Priority { get; set; }

        public ProjectTaskStatus Status { get; set; }

        public int EstimatedHours { get; set; }

        public int ActualHours { get; set; }

        public DateTime DueDate { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}