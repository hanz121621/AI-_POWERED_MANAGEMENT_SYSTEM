using AI_PMS.Domain.Entities;

namespace AI_PMS.Application.DTOs.Users
{
    public class CreateUserDto
    {
        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public Role Role { get; set; } = Role.Contributor;

        public string? PhoneNumber { get; set; }

        public string? Bio { get; set; }

        public Guid? OrganizationId { get; set; }
    }
}