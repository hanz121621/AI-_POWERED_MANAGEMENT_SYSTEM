using AI_PMS.Domain.Common;

namespace AI_PMS.Domain.Entities;

public class Project : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public Guid OrganizationId { get; set; }

    public Organization Organization { get; set; } = null!;

    public Guid? ProjectManagerId { get; set; }

    public User? ProjectManager { get; set; }

    public ICollection<Sprint> Sprints { get; set; } = new List<Sprint>();

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}