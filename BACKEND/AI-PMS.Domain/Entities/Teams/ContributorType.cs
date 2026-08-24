
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.Teams
{
    public class ContributorType
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // One ContributorType can have many ContributorSubTypes
        public ICollection<ContributorSubType> SubTypes { get; set; }
            = new List<ContributorSubType>();

        // One ContributorType can be assigned to many team members
        public ICollection<TeamMember> TeamMembers { get; set; }
            = new List<TeamMember>();
    }
}
