namespace AI_PMS.Application.DTOs.AI
{
    public class AiTeamPerformanceDto
    {
        public string OverallProductivity { get; set; } = string.Empty; // "High", "Moderate", "Low"
        public string WorkloadAssessment { get; set; } = string.Empty;
        public string KeyStrengths { get; set; } = string.Empty;
        public string AreasForImprovement { get; set; } = string.Empty;
        public string RecommendedAction { get; set; } = string.Empty;
    }
}