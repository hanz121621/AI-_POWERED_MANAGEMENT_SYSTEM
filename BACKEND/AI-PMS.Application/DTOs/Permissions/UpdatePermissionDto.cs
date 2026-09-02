using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Permissions
{
    public class UpdatePermissionDto
    {
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public bool IsActive { get; set; }
    }
}
