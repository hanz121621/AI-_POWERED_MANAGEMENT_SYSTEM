using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.AIPreferences;

public class UpdateAIPreferenceDto
{
    // =====================================================
    // GENERAL AI CONFIGURATION
    // =====================================================

    public bool IsAIEnabled { get; set; }

    public bool RecommendationsEnabled { get; set; }

    public bool RiskAnalysisEnabled { get; set; }

    public bool AIAlertsEnabled { get; set; }

    [Required]
    [MaxLength(50)]
    public string SuggestionApprovalMode { get; set; } = "manual";

    public bool AllowAIDataUsage { get; set; }

    [Range(1, 1440)]
    public int AnalysisFrequencyMinutes { get; set; } = 60;

    // =====================================================
    // MANAGER AI PREFERENCES
    // =====================================================

    /// <summary>
    /// Enable or disable AI warnings when tasks/projects
    /// are likely to be delayed.
    /// </summary>
    public bool DelayWarningsEnabled { get; set; }

    /// <summary>
    /// Frequency at which AI summaries are presented.
    /// Value is expressed in minutes.
    /// </summary>
    [Range(5, 10080)]
    public int SummaryFrequencyMinutes { get; set; } = 60;

    /// <summary>
    /// Controls whether AI recommendations are displayed
    /// to the Manager.
    /// </summary>
    public bool RecommendationDisplayEnabled { get; set; }

    /// <summary>
    /// Controls whether AI insights are visible to the Manager.
    /// </summary>
    public bool AIInsightsVisible { get; set; }

    /// <summary>
    /// AI notification priority.
    /// Allowed values: low, normal, high.
    /// </summary>
    [Required]
    [RegularExpression(
        "^(low|normal|high)$",
        ErrorMessage = "AINotificationPriority must be low, normal, or high.")]
    public string AINotificationPriority { get; set; } = "normal";
}