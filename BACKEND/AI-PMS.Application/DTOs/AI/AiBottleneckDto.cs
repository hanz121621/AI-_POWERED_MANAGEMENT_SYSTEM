using System.Collections.Generic;

namespace AI_PMS.Application.DTOs.AI
{
    public class AiBottleneckDto
    {
        public string BottleneckType { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string AffectedArea { get; set; } = string.Empty;
        public string ContributingFactors { get; set; } = string.Empty;
        public string PotentialImpact { get; set; } = string.Empty;
        public string SuggestedAction { get; set; } = string.Empty;
    }
}