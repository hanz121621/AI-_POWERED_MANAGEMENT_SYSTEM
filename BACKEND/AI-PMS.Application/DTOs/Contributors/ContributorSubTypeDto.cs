
namespace AI_PMS.Application.DTOs.Contributors
{
    public class ContributorSubTypeDto
    {
        public Guid Id { get; set; }

        public Guid ContributorTypeId { get; set; }

        public string ContributorTypeName { get; set; }
            = string.Empty;

        public string Name { get; set; }
            = string.Empty;

        public string? Description { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}

