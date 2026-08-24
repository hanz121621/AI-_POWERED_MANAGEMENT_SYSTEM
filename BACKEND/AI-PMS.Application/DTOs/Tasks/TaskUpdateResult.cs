using AI_PMS.Application.DTOs.Tasks;

namespace AI_PMS.Application.DTOs.Tasks
{
    public class TaskUpdateResult
    {
        public TaskDto? Task { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}