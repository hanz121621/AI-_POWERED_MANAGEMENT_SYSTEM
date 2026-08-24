
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.Teams
{
    public class ContributorSubType
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public Guid ContributorTypeId { get; set; }

        // Navigation property
        public ContributorType? ContributorType { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // A subtype can be assigned to many team members
        public ICollection<TeamMember> TeamMembers { get; set; }
            = new List<TeamMember>();
    }
}
