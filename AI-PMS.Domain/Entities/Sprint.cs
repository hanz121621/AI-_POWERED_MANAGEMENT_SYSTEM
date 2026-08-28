using AI_PMS.Domain.Common;

namespace AI_PMS.Domain.Entities;

public class Sprint : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Goal { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public Guid ProjectId { get; set; }

    public Project Project { get; set; } = null!;

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}