using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.SubTasks
{
    public class UpdateAISubTaskStatusDto
    {
        public ProjectTaskStatus Status { get; set; }

        public int Progress { get; set; }
    }
}