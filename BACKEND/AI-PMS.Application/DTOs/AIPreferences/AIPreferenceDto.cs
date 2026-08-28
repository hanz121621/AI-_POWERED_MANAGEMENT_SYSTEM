
namespace AI_PMS.Application.DTOs.AIPreferences;

public class AIPreferenceDto
{
    public Guid UserId { get; set; }

    // =========================================================
    // GENERAL AI CONFIGURATION
    // =========================================================

    public bool AIEnabled { get; set; }

    public bool RecommendationsEnabled { get; set; }

    public bool RiskAnalysisEnabled { get; set; }

    public bool AIAlertsEnabled { get; set; }

    public string SuggestionApprovalMode { get; set; } = "manual";

    public bool AllowAIDataUsage { get; set; }

    public int AnalysisFrequencyMinutes { get; set; }

    // =========================================================
    // MANAGER AI PREFERENCES
    // =========================================================

    public bool DelayWarningsEnabled { get; set; }

    public int SummaryFrequencyMinutes { get; set; }

    public bool RecommendationDisplayEnabled { get; set; }

    public bool AIInsightsVisible { get; set; }

    public string AINotificationPriority { get; set; } = "normal";

    // =========================================================
    // AUDIT
    // =========================================================

    public DateTime UpdatedAt { get; set; }
}
