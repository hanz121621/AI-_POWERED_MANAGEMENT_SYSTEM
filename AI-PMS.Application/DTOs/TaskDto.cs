namespace AI_PMS.Application.DTOs;

public class TaskDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string Status { get; set; } = string.Empty;

    public string Priority { get; set; } = string.Empty;

    public Guid ProjectId { get; set; }

    public Guid? SprintId { get; set; }

    public Guid? AssignedUserId { get; set; }

    public int? EstimatedHours { get; set; }

    public int? ActualHours { get; set; }

    public DateTime? DueDate { get; set; }
}