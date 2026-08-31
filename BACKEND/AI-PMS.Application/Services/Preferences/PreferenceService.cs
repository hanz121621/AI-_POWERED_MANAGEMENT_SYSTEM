using AI_PMS.Application.DTOs.AIPreferences;
using AI_PMS.Application.DTOs.DashboardPreferences;
using AI_PMS.Application.Interfaces.Data;
using AI_PMS.Application.Interfaces.Preferences;
using AI_PMS.Domain.Entities.AISettings;
using AI_PMS.Domain.Entities.DashboardSettings;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Application.Services.Preferences;

public class PreferenceService : IPreferenceService
{
    private readonly IApplicationDbContext _context;

    public PreferenceService(IApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // DASHBOARD PREFERENCE
    // =========================================================\
public async Task<DashboardPreferenceDto>
    GetDashboardPreferenceAsync(Guid userId)
{
    var preference = await _context.DashboardPreferences
        .Include(x => x.Widgets)
        .FirstOrDefaultAsync(x => x.UserId == userId);

    if (preference == null)
    {
        preference = new DashboardPreference
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.DashboardPreferences.AddAsync(preference);

        var widgets = CreateDefaultWidgets(preference.Id);

        await _context.DashboardPreferenceWidgets
            .AddRangeAsync(widgets);

        preference.Widgets = widgets;

        await _context.SaveChangesAsync();
    }
    else if (!preference.Widgets.Any())
    {
        var widgets = CreateDefaultWidgets(preference.Id);

        await _context.DashboardPreferenceWidgets
            .AddRangeAsync(widgets);

        preference.Widgets = widgets;

        await _context.SaveChangesAsync();
    }

    return MapDashboardPreference(preference);
}

public async Task<DashboardPreferenceDto>
    UpdateDashboardPreferenceAsync(
        Guid userId,
        UpdateDashboardPreferenceDto dto)
{
    // =========================================================
    // VALIDATION
    // =========================================================

    if (dto == null)
    {
        throw new ArgumentNullException(nameof(dto));
    }

    // =========================================================
    // GET EXISTING PREFERENCE
    // =========================================================

    var preference = await _context.DashboardPreferences
        .Include(x => x.Widgets)
        .FirstOrDefaultAsync(x => x.UserId == userId);

    // =========================================================
    // CREATE IF IT DOES NOT EXIST
    // =========================================================

    if (preference == null)
    {
        preference = new DashboardPreference
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _context.DashboardPreferences
            .AddAsync(preference);

        var defaultWidgets =
            CreateDefaultWidgets(preference.Id);

        await _context.DashboardPreferenceWidgets
            .AddRangeAsync(defaultWidgets);

        preference.Widgets = defaultWidgets;
    }

    // =========================================================
    // RESET TO DEFAULT
    // =========================================================

    if (dto.ResetToDefault)
    {
        preference.DefaultView = "overview";
        preference.DefaultFilter = "all";

        preference.ShowProjectProgress = true;
        preference.ShowSprintProgress = true;
        preference.ShowProjectTimeline = true;
        preference.ShowRisksAndIssues = true;
        preference.ShowTeamProgress = true;
        preference.ShowDeadlineInformation = true;
        preference.ShowAIRecommendations = true;
        preference.ShowAIRiskPrediction = true;
        preference.ShowRecentActivity = true;
        preference.ShowNotifications = true;

        // Remove current widget configuration
        if (preference.Widgets.Any())
        {
            _context.DashboardPreferenceWidgets
                .RemoveRange(preference.Widgets);
        }

        // Create default widget configuration
        var defaultWidgets =
            CreateDefaultWidgets(preference.Id);

        await _context.DashboardPreferenceWidgets
            .AddRangeAsync(defaultWidgets);

        preference.Widgets = defaultWidgets;

        preference.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapDashboardPreference(preference);
    }

    // =========================================================
    // VALIDATE DEFAULT VIEW
    // =========================================================

    var defaultView =
        string.IsNullOrWhiteSpace(dto.DefaultView)
            ? "overview"
            : dto.DefaultView.Trim().ToLowerInvariant();

    var allowedViews = new[]
    {
        "overview",
        "projects",
        "sprints",
        "tasks",
        "team",
        "analytics"
    };

    if (!allowedViews.Contains(defaultView))
    {
        throw new ArgumentException(
            "Selected dashboard view is unavailable.");
    }

    // =========================================================
    // VALIDATE DEFAULT FILTER
    // =========================================================

    var defaultFilter =
        string.IsNullOrWhiteSpace(dto.DefaultFilter)
            ? "all"
            : dto.DefaultFilter.Trim().ToLowerInvariant();

    var allowedFilters = new[]
    {
        "all",
        "active",
        "completed",
        "overdue",
        "my-work"
    };

    if (!allowedFilters.Contains(defaultFilter))
    {
        throw new ArgumentException(
            "Selected dashboard filter is unavailable.");
    }

    // =========================================================
    // UPDATE DASHBOARD SETTINGS
    // =========================================================

    preference.DefaultView = defaultView;

    preference.DefaultFilter = defaultFilter;

    preference.ShowProjectProgress =
        dto.ShowProjectProgress;

    preference.ShowSprintProgress =
        dto.ShowSprintProgress;

    preference.ShowProjectTimeline =
        dto.ShowProjectTimeline;

    preference.ShowRisksAndIssues =
        dto.ShowRisksAndIssues;

    preference.ShowTeamProgress =
        dto.ShowTeamProgress;

    preference.ShowDeadlineInformation =
        dto.ShowDeadlineInformation;

    preference.ShowAIRecommendations =
        dto.ShowAIRecommendations;

    preference.ShowAIRiskPrediction =
        dto.ShowAIRiskPrediction;

    preference.ShowRecentActivity =
        dto.ShowRecentActivity;

    preference.ShowNotifications =
        dto.ShowNotifications;

    // =========================================================
    // UPDATE WIDGET ORDER
    // =========================================================

    if (dto.WidgetOrder != null &&
        dto.WidgetOrder.Count > 0)
    {
        var requestedOrder =
            dto.WidgetOrder
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim().ToLowerInvariant())
                .Distinct()
                .ToList();

        var existingWidgets =
            preference.Widgets.ToDictionary(
                x => x.WidgetKey,
                StringComparer.OrdinalIgnoreCase);

        var order = 1;

        foreach (var widgetKey in requestedOrder)
        {
            if (existingWidgets.TryGetValue(
                    widgetKey,
                    out var widget))
            {
                widget.DisplayOrder = order++;
            }
        }

        // Any widgets not included by the client
        // are placed after the requested widgets.
        foreach (var widget in preference.Widgets
                     .OrderBy(x => x.DisplayOrder))
        {
            if (!requestedOrder.Contains(
                    widget.WidgetKey,
                    StringComparer.OrdinalIgnoreCase))
            {
                widget.DisplayOrder = order++;
            }
        }
    }

    // =========================================================
    // KEEP WIDGET VISIBILITY IN SYNC
    // =========================================================

    foreach (var widget in preference.Widgets)
    {
        widget.IsVisible = widget.WidgetKey switch
        {
            "project-progress" =>
                preference.ShowProjectProgress,

            "sprint-progress" =>
                preference.ShowSprintProgress,

            "project-timeline" =>
                preference.ShowProjectTimeline,

            "risks-and-issues" =>
                preference.ShowRisksAndIssues,

            "team-progress" =>
                preference.ShowTeamProgress,

            "deadline-information" =>
                preference.ShowDeadlineInformation,

            "ai-recommendations" =>
                preference.ShowAIRecommendations,

            "ai-risk-prediction" =>
                preference.ShowAIRiskPrediction,

            "recent-activity" =>
                preference.ShowRecentActivity,

            "notifications" =>
                preference.ShowNotifications,

            _ => widget.IsVisible
        };
    }

    // =========================================================
    // UPDATE TIMESTAMP
    // =========================================================

    preference.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return MapDashboardPreference(preference);
}

    public async Task<List<DashboardWidgetDto>>
    GetAvailableDashboardWidgetsAsync(
        Guid userId)
{
    var preference =
        await _context.DashboardPreferences
            .Include(x => x.Widgets)
            .FirstOrDefaultAsync(
                x => x.UserId == userId);

    if (preference == null)
    {
        await GetDashboardPreferenceAsync(userId);

        preference =
            await _context.DashboardPreferences
                .Include(x => x.Widgets)
                .FirstOrDefaultAsync(
                    x => x.UserId == userId);
    }

    if (preference == null)
    {
        return new List<DashboardWidgetDto>();
    }

    return MapWidgets(preference.Widgets);
}
public async Task<DashboardPreferenceDto>
    ResetDashboardPreferenceAsync(
        Guid userId)
{
    var preference =
        await _context.DashboardPreferences
            .Include(x => x.Widgets)
            .FirstOrDefaultAsync(
                x => x.UserId == userId);

    if (preference == null)
    {
        return await GetDashboardPreferenceAsync(userId);
    }

    preference.DefaultView = "overview";
    preference.DefaultFilter = "all";

    preference.ShowProjectProgress = true;
    preference.ShowSprintProgress = true;
    preference.ShowProjectTimeline = true;
    preference.ShowRisksAndIssues = true;
    preference.ShowTeamProgress = true;
    preference.ShowDeadlineInformation = true;
    preference.ShowAIRecommendations = true;
    preference.ShowAIRiskPrediction = true;
    preference.ShowRecentActivity = true;
    preference.ShowNotifications = true;

    if (preference.Widgets.Any())
    {
        _context.DashboardPreferenceWidgets
            .RemoveRange(preference.Widgets);
    }

    var widgets =
        CreateDefaultWidgets(preference.Id);

    await _context.DashboardPreferenceWidgets
        .AddRangeAsync(widgets);

    preference.Widgets = widgets;

    preference.UpdatedAt = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return MapDashboardPreference(preference);
}
    // =========================================================
    // AI PREFERENCE
    // =========================================================

















    public async Task<AIPreferenceDto> GetAIPreferenceAsync(
        Guid userId)
    {
        var preference = await _context.AIPreferences
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (preference == null)
        {
            preference = new AIPreference
{
    UserId = userId,

    // =========================================================
    // GENERAL AI DEFAULTS
    // =========================================================

    IsAIEnabled = true,
    EnableRecommendations = true,
    EnableRiskAnalysis = true,
    EnableNotifications = true,
    SuggestionApprovalMode = "Manual",
    AllowAIDataUsage = true,
    AnalysisFrequencyMinutes = 60,

    // =========================================================
    // MANAGER AI PREFERENCE DEFAULTS
    // =========================================================

    DelayWarningsEnabled = true,
    SummaryFrequencyMinutes = 60,
    RecommendationDisplayEnabled = true,
    AIInsightsVisible = true,
    AINotificationPriority = "normal",

    // =========================================================
    // AUDIT
    // =========================================================

    CreatedAt = DateTime.UtcNow,
    UpdatedAt = DateTime.UtcNow
};

            await _context.AIPreferences.AddAsync(preference);
            await _context.SaveChangesAsync();
        }

        return MapAIPreference(preference);
    }

    public async Task<AIPreferenceDto> UpdateAIPreferenceAsync(
        Guid userId,
        UpdateAIPreferenceDto dto)
    {
        var preference = await _context.AIPreferences
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (preference == null)
        {
            preference = new AIPreference
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            await _context.AIPreferences.AddAsync(preference);
        }

        // =====================================================
        // VALIDATION
        // =====================================================

        var approvalMode =
            dto.SuggestionApprovalMode.Trim().ToLower();

        var allowedApprovalModes = new[]
        {
            "manual",
            "automatic"
        };

        if (!allowedApprovalModes.Contains(approvalMode))
        {
            throw new ArgumentException(
                "Invalid suggestion approval mode.");
        }

        if (dto.AnalysisFrequencyMinutes <= 0)
        {
            throw new ArgumentException(
                "Analysis frequency must be greater than zero.");
        }

        // =====================================================
        // UPDATE
        // =====================================================

        preference.IsAIEnabled = dto.IsAIEnabled;
        preference.EnableRecommendations =
            dto.RecommendationsEnabled;

        preference.EnableRiskAnalysis =
            dto.RiskAnalysisEnabled;

        preference.EnableNotifications =
            dto.AIAlertsEnabled;

        preference.SuggestionApprovalMode =
            approvalMode;

        preference.AllowAIDataUsage =
            dto.AllowAIDataUsage;

        preference.AnalysisFrequencyMinutes =
            dto.AnalysisFrequencyMinutes;

        preference.UpdatedAt = DateTime.UtcNow;
        // =====================================================
// UPDATE MANAGER AI PREFERENCES
// =====================================================

// =====================================================
// UPDATE MANAGER AI PREFERENCES
// =====================================================

preference.DelayWarningsEnabled =
    dto.DelayWarningsEnabled;

preference.SummaryFrequencyMinutes =
    dto.SummaryFrequencyMinutes;

preference.RecommendationDisplayEnabled =
    dto.RecommendationDisplayEnabled;

preference.AIInsightsVisible =
    dto.AIInsightsVisible;

var notificationPriority =
    dto.AINotificationPriority
        .Trim()
        .ToLowerInvariant();

if (notificationPriority != "low" &&
    notificationPriority != "normal" &&
    notificationPriority != "high")
{
    throw new ArgumentException(
        "AINotificationPriority must be low, normal, or high.");
}

preference.AINotificationPriority =
    notificationPriority;

preference.UpdatedAt =
    DateTime.UtcNow;

await _context.SaveChangesAsync();

return MapAIPreference(preference);
    }

    // =========================================================
    // MAPPERS
    // =========================================================\
private static DashboardPreferenceDto MapDashboardPreference(
    DashboardPreference preference)
{
    return new DashboardPreferenceDto
    {
        UserId = preference.UserId,

        ShowProjectProgress =
            preference.ShowProjectProgress,

        ShowSprintProgress =
            preference.ShowSprintProgress,

        ShowProjectTimeline =
            preference.ShowProjectTimeline,

        ShowRisksAndIssues =
            preference.ShowRisksAndIssues,

        ShowTeamProgress =
            preference.ShowTeamProgress,

        ShowDeadlineInformation =
            preference.ShowDeadlineInformation,

        ShowAIRecommendations =
            preference.ShowAIRecommendations,

        ShowAIRiskPrediction =
            preference.ShowAIRiskPrediction,

        ShowRecentActivity =
            preference.ShowRecentActivity,

        ShowNotifications =
            preference.ShowNotifications,

        DefaultView =
            preference.DefaultView,

        DefaultFilter =
            preference.DefaultFilter,

        AvailableWidgets =
            MapWidgets(preference.Widgets),

        UpdatedAt =
            preference.UpdatedAt
    };
}
private static List<DashboardPreferenceWidget>
    CreateDefaultWidgets(Guid dashboardPreferenceId)
{
    return new List<DashboardPreferenceWidget>
    {
        new DashboardPreferenceWidget
        {
            Id = Guid.NewGuid(),
            DashboardPreferenceId = dashboardPreferenceId,
            WidgetKey = "project-progress",
            IsVisible = true,
            DisplayOrder = 1
        },

        new DashboardPreferenceWidget
        {
            Id = Guid.NewGuid(),
            DashboardPreferenceId = dashboardPreferenceId,
            WidgetKey = "sprint-progress",
            IsVisible = true,
            DisplayOrder = 2
        },

        new DashboardPreferenceWidget
        {
            Id = Guid.NewGuid(),
            DashboardPreferenceId = dashboardPreferenceId,
            WidgetKey = "project-timeline",
            IsVisible = true,
            DisplayOrder = 3
        },

        new DashboardPreferenceWidget
        {
            Id = Guid.NewGuid(),
            DashboardPreferenceId = dashboardPreferenceId,
            WidgetKey = "risks-and-issues",
            IsVisible = true,
            DisplayOrder = 4
        },

        new DashboardPreferenceWidget
        {
            Id = Guid.NewGuid(),
            DashboardPreferenceId = dashboardPreferenceId,
            WidgetKey = "team-progress",
            IsVisible = true,
            DisplayOrder = 5
        },

        new DashboardPreferenceWidget
        {
            Id = Guid.NewGuid(),
            DashboardPreferenceId = dashboardPreferenceId,
            WidgetKey = "deadline-information",
            IsVisible = true,
            DisplayOrder = 6
        },

        new DashboardPreferenceWidget
        {
            Id = Guid.NewGuid(),
            DashboardPreferenceId = dashboardPreferenceId,
            WidgetKey = "ai-recommendations",
            IsVisible = true,
            DisplayOrder = 7
        },

        new DashboardPreferenceWidget
        {
            Id = Guid.NewGuid(),
            DashboardPreferenceId = dashboardPreferenceId,
            WidgetKey = "ai-risk-prediction",
            IsVisible = true,
            DisplayOrder = 8
        },

        new DashboardPreferenceWidget
        {
            Id = Guid.NewGuid(),
            DashboardPreferenceId = dashboardPreferenceId,
            WidgetKey = "recent-activity",
            IsVisible = true,
            DisplayOrder = 9
        },

        new DashboardPreferenceWidget
        {
            Id = Guid.NewGuid(),
            DashboardPreferenceId = dashboardPreferenceId,
            WidgetKey = "notifications",
            IsVisible = true,
            DisplayOrder = 10
        }
    };
}                      private static List<DashboardWidgetDto> MapWidgets(
    IEnumerable<DashboardPreferenceWidget> widgets)
{
    return widgets
        .OrderBy(x => x.DisplayOrder)
        .Select(x => new DashboardWidgetDto
        {
            Key = x.WidgetKey,

            Name = GetWidgetName(x.WidgetKey),

            Description = GetWidgetDescription(x.WidgetKey),

            IsVisible = x.IsVisible,

            DisplayOrder = x.DisplayOrder,

            IsAvailable = true
        })
        .ToList();
}
         private static string GetWidgetName(string key)
{
    return key switch
    {
        "project-progress" => "Project Progress",
        "sprint-progress" => "Sprint Progress",
        "project-timeline" => "Project Timeline",
        "risks-and-issues" => "Risks and Issues",
        "team-progress" => "Team Progress",
        "deadline-information" => "Deadline Information",
        "ai-recommendations" => "AI Recommendations",
        "ai-risk-prediction" => "AI Risk Prediction",
        "recent-activity" => "Recent Activity",
        "notifications" => "Notifications",
        _ => key
    };
}
private static string GetWidgetDescription(string key)
{
    return key switch
    {
        "project-progress" =>
            "Shows the current progress of projects.",

        "sprint-progress" =>
            "Shows sprint progress and completion.",

        "project-timeline" =>
            "Shows project milestones and timeline.",

        "risks-and-issues" =>
            "Shows current project risks and issues.",

        "team-progress" =>
            "Shows team work and progress.",

        "deadline-information" =>
            "Shows upcoming and overdue deadlines.",

        "ai-recommendations" =>
            "Shows AI-generated project recommendations.",

        "ai-risk-prediction" =>
            "Shows AI-based project risk predictions.",

        "recent-activity" =>
            "Shows recent system and project activity.",

        "notifications" =>
            "Shows your latest notifications.",

        _ => "Dashboard information."
    };
}    

private static AIPreferenceDto MapAIPreference(
    AIPreference preference)
{
    return new AIPreferenceDto
    {
        UserId = preference.UserId,

        // =====================================================
        // GENERAL AI CONFIGURATION
        // =====================================================

        AIEnabled =
            preference.IsAIEnabled,

        RecommendationsEnabled =
            preference.EnableRecommendations,

        RiskAnalysisEnabled =
            preference.EnableRiskAnalysis,

        AIAlertsEnabled =
            preference.EnableNotifications,

        SuggestionApprovalMode =
            preference.SuggestionApprovalMode.ToLowerInvariant(),

        AllowAIDataUsage =
            preference.AllowAIDataUsage,

        AnalysisFrequencyMinutes =
            preference.AnalysisFrequencyMinutes,

        // =====================================================
        // MANAGER AI PREFERENCES
        // =====================================================

        DelayWarningsEnabled =
            preference.DelayWarningsEnabled,

        SummaryFrequencyMinutes =
            preference.SummaryFrequencyMinutes,

        RecommendationDisplayEnabled =
            preference.RecommendationDisplayEnabled,

        AIInsightsVisible =
            preference.AIInsightsVisible,

        AINotificationPriority =
            preference.AINotificationPriority.ToLowerInvariant(),

        // =====================================================
        // AUDIT
        // =====================================================

        UpdatedAt =
            preference.UpdatedAt
    };
}
}
