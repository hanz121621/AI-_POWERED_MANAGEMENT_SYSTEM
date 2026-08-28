using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.Communication
{
    public class ProjectAnnouncement
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // PROJECT
        // =========================================================

        [Required]
        public Guid ProjectId { get; set; }

        public Project? Project { get; set; }

        // =========================================================
        // TEAM
        // =========================================================

        public Guid? TeamId { get; set; }

        public Team? Team { get; set; }

        // =========================================================
        // SENDER
        // =========================================================

        [Required]
        public Guid SenderId { get; set; }

        public User? Sender { get; set; }

        // =========================================================
        // ANNOUNCEMENT CONTENT
        // =========================================================

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(5000)]
        public string Message { get; set; } = string.Empty;

        // =========================================================
        // PRIORITY
        // =========================================================

        [Required]
        public Guid PriorityId { get; set; }

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // =========================================================
        // RECIPIENTS
        // =========================================================

        public ICollection<ProjectAnnouncementRecipient>
            Recipients { get; set; }
            = new List<ProjectAnnouncementRecipient>();
    }
}