using System;

namespace AI_PMS.Application.DTOs.AI
{
    public class AiDeadlinePredictionDto
    {
        public string PredictedStatus { get; set; } = string.Empty; // "On Track", "At Risk", "Delayed"
        public string RiskLevel { get; set; } = string.Empty; // "Low", "Medium", "High", "Critical"
        public string EstimatedCompletionDate { get; set; } = string.Empty; // e.g., "October 15, 2026"
        public string DaysVariance { get; set; } = string.Empty; // e.g., "5 days late" or "On schedule"
        public string WarningMessage { get; set; } = string.Empty; // A concise, urgent warning if at risk
        public string ContributingFactors { get; set; } = string.Empty; // Why it's at risk (based on data)
        public string RecommendedAction { get; set; } = string.Empty; // What the manager should do now
    }
}