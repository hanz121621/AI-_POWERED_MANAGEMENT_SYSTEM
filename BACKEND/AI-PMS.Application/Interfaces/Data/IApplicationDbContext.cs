using AI_PMS.Domain.Entities.AISettings;
using AI_PMS.Domain.Entities.DashboardSettings;
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Entities.SystemSettings;
using AI_PMS.Domain.Entities.Projects;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Application.Interfaces.Data;

public interface IApplicationDbContext
{
    // =========================================================
    // USERS
    // =========================================================

    DbSet<User> Users { get; }

    // =========================================================
    // SYSTEM SETTINGS
    // =========================================================

    DbSet<SystemSetting> SystemSettings { get; }

    // =========================================================
    // DASHBOARD PREFERENCES
    // =========================================================

    DbSet<DashboardPreference> DashboardPreferences { get; }
     DbSet<DashboardPreferenceWidget> DashboardPreferenceWidgets { get; }
    // =========================================================
    // AI PREFERENCES
    // =========================================================

    DbSet<AIPreference> AIPreferences { get; }

    // =========================================================
    // SAVE
    // =========================================================

    Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default);
}