using System;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.AISettings;

public class AIPreference
{
    public Guid Id { get; set; }

    // =========================================================
    // OWNER
    // =========================================================

    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    // =========================================================
    // GENERAL AI CONFIGURATION
    // Admin / system-level AI settings
    // =========================================================

    public bool IsAIEnabled { get; set; }

    public bool EnableRecommendations { get; set; }

    public bool EnableRiskAnalysis { get; set; }

    public bool EnableNotifications { get; set; }

    // Manual approval / automatic application
    public string SuggestionApprovalMode { get; set; } = "Manual";

    // AI data usage
    public bool AllowAIDataUsage { get; set; }

    // General AI analysis frequency
    public int AnalysisFrequencyMinutes { get; set; }

    // =========================================================
    // MANAGER AI PREFERENCES
    // User-specific AI presentation and usage preferences
    // =========================================================

    // Enable/disable AI delay warnings
    public bool DelayWarningsEnabled { get; set; }

    // How frequently AI summaries are presented
    public int SummaryFrequencyMinutes { get; set; }

    // Whether AI recommendations are displayed to the Manager
    public bool RecommendationDisplayEnabled { get; set; }

    // Whether AI insights are visible to the Manager
    public bool AIInsightsVisible { get; set; }

    // AI notification priority
    // normal / high / low
    public string AINotificationPriority { get; set; } = "normal";

    // =========================================================
    // AUDIT
    // =========================================================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}