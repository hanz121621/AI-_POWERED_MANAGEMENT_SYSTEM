using System;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.AISettings;

public class AIPreference
{
    public Guid Id { get; set; }

    // Owner of these AI preferences
    public Guid UserId { get; set; }

    public User User { get; set; } = null!;

    // =========================================================
    // AI CONFIGURATION
    // =========================================================

    public bool IsAIEnabled { get; set; }

    public bool EnableRecommendations { get; set; }

    public bool EnableRiskAnalysis { get; set; }

    public bool EnableNotifications { get; set; }

    // Manual approval / automatic application
    public string SuggestionApprovalMode { get; set; } = "Manual";

    // AI data usage
    public bool AllowAIDataUsage { get; set; }

    // Analysis frequency in minutes
    public int AnalysisFrequencyMinutes { get; set; }

    // =========================================================
    // AUDIT
    // =========================================================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}