using AI_PMS.Domain.Entities;

namespace AI_PMS.Application.DTOs.Users
{
    public class UpdateUserDto
    {
        public string FullName { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public string? ProfileImage { get; set; }

        public string? Bio { get; set; }

        public Role Role { get; set; } = Role.Contributor;

        public Guid? OrganizationId { get; set; }
    }
}