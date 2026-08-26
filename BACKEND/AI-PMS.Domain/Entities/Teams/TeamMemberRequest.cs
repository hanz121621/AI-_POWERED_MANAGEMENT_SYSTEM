using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Domain.Entities.Teams
{
    public class TeamMemberRequest
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // REFERENCES
        // =========================================================

        public Guid ProjectId { get; set; }

        public Project? Project { get; set; }

        public Guid TeamId { get; set; }

        public Team? Team { get; set; }

        public Guid ManagerId { get; set; }

        public User? Manager { get; set; }

        public Guid UserId { get; set; }

        public User? User { get; set; }

        // =========================================================
        // REQUEST
        // =========================================================

        [MaxLength(1000)]
        public string? Reason { get; set; }

        public TeamMemberRequestType RequestType { get; set; }

        public TeamMemberRequestStatus Status { get; set; }
            = TeamMemberRequestStatus.Pending;

        // =========================================================
        // ADMIN REVIEW
        // =========================================================

        public Guid? ReviewedByAdminId { get; set; }

        public User? ReviewedByAdmin { get; set; }

        public DateTime? ReviewedAt { get; set; }

        [MaxLength(1000)]
        public string? ReviewComment { get; set; }

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}