namespace AI_PMS.Application.DTOs.AI
{
    public class AiSprintPlanningDto
    {
        public string RecommendedSprintCapacity { get; set; } = string.Empty; // e.g., "5-7 tasks"
        public string PriorityFocus { get; set; } = string.Empty;
        public string PotentialBlockers { get; set; } = string.Empty;
        public string SprintGoalSuggestion { get; set; } = string.Empty;
        public string RecommendedAction { get; set; } = string.Empty;
    }
}