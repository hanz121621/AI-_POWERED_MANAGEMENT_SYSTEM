using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Domain.Entities.Permissions
{
    public class RolePermission
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // The system role this permission belongs to
        [Required]
        public Role Role { get; set; }

        // Permission being assigned to the role
        [Required]
        public Guid PermissionId { get; set; }

        public Permission Permission { get; set; } = null!;

        // Configurable permission value
        public bool IsEnabled { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}