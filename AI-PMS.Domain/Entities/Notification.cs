using AI_PMS.Domain.Common;

namespace AI_PMS.Domain.Entities;

public class Notification : BaseEntity
{
    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public bool IsRead { get; set; }

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;
}