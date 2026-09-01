using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.Notifications
{
    public class NotificationType
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

        public ICollection<Notification> Notifications { get; set; }
            = new List<Notification>();
    }
}