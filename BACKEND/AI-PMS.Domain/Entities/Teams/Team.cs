using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.Teams
{
    public class Team
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }


        public Guid? ManagerId { get; set; }

        public User? Manager { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public ICollection<TeamMember> TeamMembers { get; set; }
            = new List<TeamMember>();
    }
}