using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Entities.Auth;

using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.Permissions
{
    public class UserPermission
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // User receiving the permission override
        [Required]
        public Guid UserId { get; set; }

        public User User { get; set; } = null!;

        // Permission being overridden
        [Required]
        public Guid PermissionId { get; set; }

        public Permission Permission { get; set; } = null!;

        // User-specific permission value
        public bool IsEnabled { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}