namespace AI_PMS.Application.DTOs.AIPreferences;

public class AIPreferenceDto
{
    public Guid UserId { get; set; }

    public bool AIEnabled { get; set; }

    public bool RecommendationsEnabled { get; set; }

    public bool RiskAnalysisEnabled { get; set; }

    public bool AIAlertsEnabled { get; set; }

    public string SuggestionApprovalMode { get; set; } = "manual";

    public bool AllowAIDataUsage { get; set; }

    public int AnalysisFrequencyMinutes { get; set; }
}