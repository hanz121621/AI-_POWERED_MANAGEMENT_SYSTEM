namespace AI_PMS.Application.DTOs.SubTasks
{
    public class CreateSubTaskDto
    {
        public Guid TaskId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int EstimatedHours { get; set; }

        public bool IsAIGenerated { get; set; } = false;
    }
}