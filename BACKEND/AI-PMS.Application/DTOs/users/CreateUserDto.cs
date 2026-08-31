using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Users
{
    public class CreateUserDto
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required]
        public Role Role { get; set; } = Role.Contributor;

        public bool IsActive { get; set; } = true;

        public Guid? ContributorTypeId { get; set; }

        public Guid? ContributorSubTypeId { get; set; }

        [Phone]
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(500)]
        public string? Bio { get; set; }

        // =====================================================
        // PROFESSIONAL INFORMATION
        // =====================================================

        [MaxLength(2000)]
        public string? TechnicalSkills { get; set; }

        // =====================================================
        // PROFILE IMAGE
        // =====================================================

        public string? ProfileImage { get; set; }
    }
}