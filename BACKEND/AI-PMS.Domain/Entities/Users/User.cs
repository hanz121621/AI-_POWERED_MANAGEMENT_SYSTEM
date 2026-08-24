
using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Auth;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Domain.Entities.Users
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

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

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        // =========================================================
        // SYSTEM ROLE
        // =========================================================

        [Required]
        public Role Role { get; set; } = Role.Contributor;

        public bool IsActive { get; set; } = true;

        // =========================================================
        // CONTACT / PROFILE
        // =========================================================

        [Phone]
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public string? ProfileImage { get; set; }

        [MaxLength(500)]
        public string? Bio { get; set; }

        // =========================================================
        // USER PREFERENCES
        // =========================================================

        [MaxLength(20)]
        public string LanguagePreference { get; set; } = "en";

        [MaxLength(20)]
        public string ThemePreference { get; set; } = "system";

        // =========================================================
        // CONTRIBUTOR CLASSIFICATION
        // =========================================================

        // Used when Role = Contributor.
        //
        // Example:
        // Developer
        // Staff
        public Guid? ContributorTypeId { get; set; }

        public ContributorType? ContributorType { get; set; }

        // Optional subtype belonging to the selected
        // ContributorType.
        //
        // Example:
        // Frontend Developer
        // Backend Developer
        // Full Stack Developer
        // Mobile Developer
        // QA
        // UI/UX Designer
        // Business Analyst
        public Guid? ContributorSubTypeId { get; set; }

        public ContributorSubType? ContributorSubType { get; set; }

        // =========================================================
        // PASSWORD RESET
        // =========================================================

        public string? PasswordResetToken { get; set; }

        public DateTime? PasswordResetTokenExpiry { get; set; }

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // =========================================================
        // REFRESH TOKENS
        // =========================================================

        public ICollection<RefreshToken> RefreshTokens { get; set; }
            = new List<RefreshToken>();
    }

}