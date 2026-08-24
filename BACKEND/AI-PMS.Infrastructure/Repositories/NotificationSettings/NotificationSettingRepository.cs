using AI_PMS.Application.Interfaces.Repositories.NotificationSettings;
using AI_PMS.Domain.Entities.NotificationSettings;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.NotificationSettings;

public class NotificationSettingRepository
    : INotificationSettingRepository
{
    private readonly ApplicationDbContext _context;

    public NotificationSettingRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET
    // =========================================================

    public async Task<NotificationSetting?> GetAsync()
    {
        return await _context.NotificationSettings
            .FirstOrDefaultAsync();
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<NotificationSetting> AddAsync(
        NotificationSetting setting)
    {
        _context.NotificationSettings.Add(setting);

        await _context.SaveChangesAsync();

        return setting;
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task UpdateAsync(
        NotificationSetting setting)
    {
        _context.NotificationSettings.Update(setting);

        await _context.SaveChangesAsync();
    }
}