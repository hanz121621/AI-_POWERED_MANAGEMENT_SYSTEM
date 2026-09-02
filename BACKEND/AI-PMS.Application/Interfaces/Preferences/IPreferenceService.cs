using AI_PMS.Application.DTOs.AIPreferences;
using AI_PMS.Application.DTOs.DashboardPreferences;

namespace AI_PMS.Application.Interfaces.Preferences;

public interface IPreferenceService
{
    // =========================================================
    // DASHBOARD PREFERENCES
    // =========================================================

    Task<DashboardPreferenceDto>
        GetDashboardPreferenceAsync(
            Guid userId);

    Task<DashboardPreferenceDto>
        UpdateDashboardPreferenceAsync(
            Guid userId,
            UpdateDashboardPreferenceDto dto);

    // =========================================================
    // AVAILABLE DASHBOARD WIDGETS
    // =========================================================

    Task<List<DashboardWidgetDto>>
        GetAvailableDashboardWidgetsAsync(
            Guid userId);

    // =========================================================
    // RESET DASHBOARD
    // =========================================================

    Task<DashboardPreferenceDto>
        ResetDashboardPreferenceAsync(
            Guid userId);

    // =========================================================
    // AI PREFERENCES
    // =========================================================

    Task<AIPreferenceDto>
        GetAIPreferenceAsync(
            Guid userId);

    Task<AIPreferenceDto>
        UpdateAIPreferenceAsync(
            Guid userId,
            UpdateAIPreferenceDto dto);
}
