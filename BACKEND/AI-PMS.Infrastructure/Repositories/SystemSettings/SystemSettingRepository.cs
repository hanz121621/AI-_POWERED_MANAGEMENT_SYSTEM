using AI_PMS.Domain.Entities.SystemSettings;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.SystemSettings;

public class SystemSettingRepository
{
    private readonly ApplicationDbContext _context;

    public SystemSettingRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================================================
    // GET SYSTEM SETTINGS
    // =========================================================

    public async Task<SystemSetting?> GetAsync()
    {
        return await _context.SystemSettings
            .FirstOrDefaultAsync();
    }

    // =========================================================
    // CREATE SYSTEM SETTINGS
    // =========================================================

    public async Task<SystemSetting> AddAsync(
        SystemSetting setting)
    {
        _context.SystemSettings.Add(setting);

        await _context.SaveChangesAsync();

        return setting;
    }

    // =========================================================
    // UPDATE SYSTEM SETTINGS
    // =========================================================

    public async Task UpdateAsync(
        SystemSetting setting)
    {
        _context.SystemSettings.Update(setting);

        await _context.SaveChangesAsync();
    }
}