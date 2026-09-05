namespace AI_PMS.Application.DTOs.AI
{
    public class AiProgressPredictionDto
    {
        public string PredictedCompletionPercentage { get; set; } = string.Empty; // e.g., "85%"
        public string Trajectory { get; set; } = string.Empty; // "Ahead of Schedule", "On Track", "Behind Schedule"
        public string VelocityAnalysis { get; set; } = string.Empty;
        public string RiskToDeadline { get; set; } = string.Empty;
        public string RecommendedAction { get; set; } = string.Empty;
    }
}