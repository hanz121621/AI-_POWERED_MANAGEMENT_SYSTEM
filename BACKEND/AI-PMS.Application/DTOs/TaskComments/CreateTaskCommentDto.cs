using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.TaskComments
{
    public class CreateTaskCommentDto
    {
        [Required]
        public Guid TaskId { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Content { get; set; } = string.Empty;
    }
}