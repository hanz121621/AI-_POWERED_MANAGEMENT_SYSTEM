using System.Collections.Generic;

namespace AI_PMS.Application.DTOs.AI // 🌟 Must match the folder path
{
    public class TaskBreakdownResponse
    {
        public List<AISuggestedTask> Tasks { get; set; } = new();
    }

    public class AISuggestedTask
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int EstimatedHours { get; set; }
        public string RecommendedRole { get; set; } = string.Empty;
    }
}