using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Permissions
{
    public class RolePermissionDto
    {
        public Guid Id { get; set; }

        public Role Role { get; set; }

        public Guid PermissionId { get; set; }

        public string PermissionName { get; set; } = string.Empty;

        public bool IsEnabled { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
