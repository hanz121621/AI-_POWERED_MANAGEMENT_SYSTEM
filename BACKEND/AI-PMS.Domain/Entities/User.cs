namespace AI_PMS.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public Role Role { get; set; } = Role.Contributor;

        public bool IsActive { get; set; } = true;

        public string? PhoneNumber { get; set; }

        public string? ProfileImage { get; set; }

        public string? Bio { get; set; }

        public Guid? OrganizationId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}