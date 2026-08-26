using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.Teams
{
    public class TeamMember
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TeamId { get; set; }

        public Team? Team { get; set; }

        [Required]
        public Guid UserId { get; set; }

        public User? User { get; set; }

        // =========================================================
        // CONTRIBUTOR CLASSIFICATION
        // =========================================================

        [Required]
        public Guid ContributorTypeId { get; set; }

        public ContributorType? ContributorType { get; set; }

        public Guid? ContributorSubTypeId { get; set; }

        public ContributorSubType? ContributorSubType { get; set; }

        // =========================================================
        // TEAM LEADER
        // =========================================================

        public bool IsTeamLeader { get; set; } = false;

        // =========================================================
        // MEMBERSHIP
        // =========================================================

        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;
    }
}