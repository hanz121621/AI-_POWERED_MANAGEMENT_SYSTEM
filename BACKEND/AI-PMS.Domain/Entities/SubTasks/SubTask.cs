using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.SubTasks
{
    public class SubTask
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TaskId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public int EstimatedHours { get; set; }

        public bool IsAIGenerated { get; set; } = false;

        // Kept for compatibility with the existing database/model.
        // It is not part of the new use-case workflow.
        public bool IsApproved { get; set; } = false;

        public bool IsDeleted { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? DeletedAt { get; set; }
    }
}