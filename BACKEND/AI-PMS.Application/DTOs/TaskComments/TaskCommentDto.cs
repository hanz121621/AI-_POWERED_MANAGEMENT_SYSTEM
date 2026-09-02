namespace AI_PMS.Application.DTOs.TaskComments
{
    public class TaskCommentDto
    {
        public Guid Id { get; set; }

        public Guid TaskId { get; set; }

        public Guid CreatedBy { get; set; }

        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}