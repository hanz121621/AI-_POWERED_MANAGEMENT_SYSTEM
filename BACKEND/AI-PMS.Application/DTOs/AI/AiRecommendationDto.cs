using System.Collections.Generic;

namespace AI_PMS.Application.DTOs.AI
{
    public class AiRecommendationDto
    {
        public string Category { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SuggestedAction { get; set; } = string.Empty;
    }
}