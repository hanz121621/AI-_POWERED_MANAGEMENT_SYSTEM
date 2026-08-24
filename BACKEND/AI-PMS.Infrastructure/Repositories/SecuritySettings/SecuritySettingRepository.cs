using AI_PMS.Application.Interfaces.Repositories.SecuritySettings;
using AI_PMS.Domain.Entities.SecuritySettings;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.SecuritySettings;

public class SecuritySettingRepository
    : ISecuritySettingRepository
{
    private readonly ApplicationDbContext _context;

    public SecuritySettingRepository(
        ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<SecuritySetting?> GetAsync()
    {
        return await _context.SecuritySettings
            .FirstOrDefaultAsync();
    }

    public async Task<SecuritySetting> AddAsync(
        SecuritySetting setting)
    {
        _context.SecuritySettings.Add(setting);

        await _context.SaveChangesAsync();

        return setting;
    }

    public async Task UpdateAsync(
        SecuritySetting setting)
    {
        _context.SecuritySettings.Update(setting);

        await _context.SaveChangesAsync();
    }
}