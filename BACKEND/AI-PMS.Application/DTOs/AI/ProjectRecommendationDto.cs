namespace AI_PMS.Application.DTOs.AI
{
    public class ProjectRecommendationDto
    {
        public string RecommendationType { get; set; } = string.Empty; // e.g., "Delayed Tasks", "Blocked Work"
        public string Priority { get; set; } = string.Empty;           // e.g., "High", "Medium", "Low"
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SuggestedAction { get; set; } = string.Empty;
    }
}