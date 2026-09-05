namespace AI_PMS.Application.DTOs.AI
{
    public class AiSubtaskBreakdownDto
    {
        public string SubtaskTitle { get; set; } = string.Empty;
        public List<string> TechnicalSteps { get; set; } = new List<string>();
        public int EstimatedHours { get; set; }
        public string PotentialRisks { get; set; } = string.Empty;
        public string RecommendedTools { get; set; } = string.Empty;
    }
}