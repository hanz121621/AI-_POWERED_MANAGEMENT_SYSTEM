using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Communication;

namespace AI_PMS.Domain.Entities.TaskComments
{
    public class TaskComment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TaskId { get; set; }

        [Required]
        public Guid CreatedBy { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public bool IsDeleted { get; set; } = false;

     public ICollection<MessageMention> Mentions { get; set; }
    = new List<MessageMention>();
        public DateTime? DeletedAt { get; set; }
    }
}