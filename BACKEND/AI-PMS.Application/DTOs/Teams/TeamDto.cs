namespace AI_PMS.Application.DTOs.Teams
{
    public class TeamDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public Guid? ManagerId { get; set; }

        public string? ManagerName { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        // TEAM-004
        public int MemberCount { get; set; }

        public int DeveloperCount { get; set; }

        public int StaffCount { get; set; }

        public List<TeamMemberDto> Members { get; set; } = new();
    }

    public class TeamMemberDto
    {
        public Guid UserId { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public Guid ContributorTypeId { get; set; }

        public string ContributorTypeName { get; set; } = string.Empty;

        public Guid? ContributorSubTypeId { get; set; }

        public string? ContributorSubTypeName { get; set; }

        public DateTime JoinedAt { get; set; }

        public bool IsActive { get; set; }
    }
}