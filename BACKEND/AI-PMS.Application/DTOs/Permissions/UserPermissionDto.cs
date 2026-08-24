namespace AI_PMS.Application.DTOs.Permissions
{
    public class UserPermissionDto
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string UserName { get; set; } = string.Empty;

        public Guid PermissionId { get; set; }

        public string PermissionName { get; set; } = string.Empty;

        public bool IsEnabled { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}