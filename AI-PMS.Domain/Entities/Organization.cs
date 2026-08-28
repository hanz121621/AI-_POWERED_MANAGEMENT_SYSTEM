using AI_PMS.Domain.Common;

namespace AI_PMS.Domain.Entities;

public class Organization : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();

    public ICollection<Project> Projects { get; set; } = new List<Project>();
}