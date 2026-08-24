
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Users
{
    public class UserDto
    {
        // =========================================================
        // BASIC INFORMATION
        // =========================================================

        public Guid Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        // =========================================================
        // SYSTEM ROLE
        // =========================================================

        public Role Role { get; set; }

        public bool IsActive { get; set; }

        // =========================================================
        // OTHER INFORMATION
        // =========================================================

        public string? PhoneNumber { get; set; }

        public string? ProfileImage { get; set; }

        public string? Bio { get; set; }

        // =========================================================
        // CONTRIBUTOR CLASSIFICATION
        // =========================================================

        // Selected contributor type.
        //
        // Example:
        // Developer
        // Staff
        public Guid? ContributorTypeId { get; set; }

        public string? ContributorTypeName { get; set; }

        // Selected contributor subtype.
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

        public string? ContributorSubTypeName { get; set; }

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}