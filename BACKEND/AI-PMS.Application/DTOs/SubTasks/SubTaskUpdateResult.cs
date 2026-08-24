namespace AI_PMS.Application.DTOs.SubTasks
{
    public class SubTaskUpdateResult
    {
        public SubTaskDto? SubTask { get; set; }

        public string Message { get; set; } = string.Empty;

        public bool Success { get; set; }
    }
}