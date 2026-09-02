using AI_PMS.Domain.Enums;
using AI_PMS.Domain.Entities.Projects;

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
        // CONTACT / PROFILE
        // =========================================================

        public string? PhoneNumber { get; set; }

        public string? ProfileImage { get; set; }

        public string? Bio { get; set; }

        // =========================================================
        // PROFESSIONAL INFORMATION
        // =========================================================

        public string? TechnicalSkills { get; set; }

        // =========================================================
        // CONTRIBUTOR CLASSIFICATION
        // =========================================================

        public Guid? ContributorTypeId { get; set; }

        public string? ContributorTypeName { get; set; }

        public Guid? ContributorSubTypeId { get; set; }

        public string? ContributorSubTypeName { get; set; }

        // =========================================================
        // TEAM
        // =========================================================

        public Guid? TeamId { get; set; }

        public string? TeamName { get; set; }

        // =========================================================
        // ASSIGNED PROJECTS
        // =========================================================

        public IEnumerable<UserProjectDto> AssignedProjects { get; set; }
            = new List<UserProjectDto>();

        // =========================================================
        // LOGIN INFORMATION
        // =========================================================

        public DateTime? LastLoginAt { get; set; }

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }

    // =============================================================
    // ASSIGNED PROJECT DTO
    // =============================================================

    public class UserProjectDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public ProjectPriority Priority { get; set; }

        public decimal ProgressPercentage { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime Deadline { get; set; }
    }
}