using AI_PMS.Domain.Entities;

namespace AI_PMS.Application.DTOs.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public Role Role { get; set; }

        public bool IsActive { get; set; }

        public string? PhoneNumber { get; set; }

        public string? ProfileImage { get; set; }

        public string? Bio { get; set; }

        public Guid? OrganizationId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}