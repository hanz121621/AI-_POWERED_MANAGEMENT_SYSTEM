using AI_PMS.Domain.Common;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Domain.Entities;

public class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public Role Role { get; set; }

    public Guid? OrganizationId { get; set; }

    public Organization? Organization { get; set; }

    public ICollection<Project> Projects { get; set; } = new List<Project>();

    public ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();
}