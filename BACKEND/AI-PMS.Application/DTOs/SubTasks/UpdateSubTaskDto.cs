namespace AI_PMS.Application.DTOs.SubTasks
{
    public class UpdateSubTaskDto
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int EstimatedHours { get; set; }
    }
}
