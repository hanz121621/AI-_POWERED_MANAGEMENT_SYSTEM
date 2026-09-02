
using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Users
{
    public class UpdateUserDto
    {
        // =========================================================
        // BASIC INFORMATION
        // =========================================================

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        // =========================================================
        // SYSTEM ROLE
        // =========================================================

        [Required]
        public Role Role { get; set; }

        public bool IsActive { get; set; }

        // =========================================================
        // CONTRIBUTOR CLASSIFICATION
        // =========================================================

        // Selected contributor type.
        //
        // Examples:
        // Developer
        // Staff
        //
        // References ContributorType.Id.
        public Guid? ContributorTypeId { get; set; }

        // Selected contributor subtype.
        //
        // Examples:
        // Frontend Developer
        // Backend Developer
        // Full Stack Developer
        // Mobile Developer
        // QA
        // UI/UX Designer
        // Business Analyst
        //
        // References ContributorSubType.Id.
        //
        // Nullable because a contributor type may not require
        // a subtype.
        public Guid? ContributorSubTypeId { get; set; }

        // =========================================================
        // CONTACT / PROFILE INFORMATION
        // =========================================================

        [Phone]
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(500)]
        public string? Bio { get; set; }

        // =========================================================
        // PROFESSIONAL INFORMATION
        // =========================================================

        [MaxLength(2000)]
        public string? TechnicalSkills { get; set; }

        // =========================================================
        // PROFILE IMAGE
        // =========================================================

        public string? ProfileImage { get; set; }
    }
}
