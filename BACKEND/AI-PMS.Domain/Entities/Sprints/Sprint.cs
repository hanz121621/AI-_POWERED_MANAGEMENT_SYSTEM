using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Domain.Entities.Sprints
{
    public class Sprint
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ProjectId { get; set; }

        // Manager who created the sprint
        [Required]
        public Guid CreatedBy { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Goal { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public SprintStatus Status { get; set; }
            = SprintStatus.Planned;

        public SprintPriority Priority { get; set; }
            = SprintPriority.Medium;

        public DateTime CreatedAt { get; set; }
            = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // GLOBAL RULE:
        // Never physically delete records.
        public bool IsDeleted { get; set; } = false;
    }
}