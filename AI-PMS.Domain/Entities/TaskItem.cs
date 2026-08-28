using AI_PMS.Domain.Common;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Domain.Entities;

public class TaskItem : BaseEntity
{
    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public TaskState Status { get; set; } = TaskState.Backlog;

    public Priority Priority { get; set; } = Priority.Medium;

    public DateTime? DueDate { get; set; }

    public Guid ProjectId { get; set; }

    public Project Project { get; set; } = null!;

    public Guid? SprintId { get; set; }

    public Sprint? Sprint { get; set; }

    public Guid? AssignedUserId { get; set; }

    public User? AssignedUser { get; set; }

    public int? EstimatedHours { get; set; }

    public int? ActualHours { get; set; }
}