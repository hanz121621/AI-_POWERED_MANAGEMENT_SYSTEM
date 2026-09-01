using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.Communication
{
    public class Message
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // SENDER / RECEIVER
        // =========================================================

        [Required]
        public Guid SenderId { get; set; }

        public User? Sender { get; set; }

        [Required]
        public Guid ReceiverId { get; set; }

        public User? Receiver { get; set; }

        // =========================================================
        // PROJECT / TEAM CONTEXT
        // =========================================================

        [Required]
        public Guid ProjectId { get; set; }

        public Project? Project { get; set; }

        [Required]
        public Guid TeamId { get; set; }

        public Team? Team { get; set; }

        // =========================================================
        // MESSAGE
        // =========================================================

        [Required]
        [MaxLength(5000)]
        public string Content { get; set; } = string.Empty;

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}