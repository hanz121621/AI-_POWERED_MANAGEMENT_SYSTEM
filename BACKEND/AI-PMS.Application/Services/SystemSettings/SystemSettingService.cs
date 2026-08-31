using AI_PMS.Application.DTOs.SystemSettings;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Auth;
using AI_PMS.Application.Interfaces.Data;
using AI_PMS.Application.Interfaces.SystemSettings;
using AI_PMS.Domain.Entities.SystemSettings;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Application.Services.SystemSettings;

public class SystemSettingService : ISystemSettingService
{
    private readonly IApplicationDbContext _context;
    private readonly IAuditLogService _auditLogService;
    private readonly ICurrentUserService _currentUserService;

    public SystemSettingService(
        IApplicationDbContext context,
        IAuditLogService auditLogService,
        ICurrentUserService currentUserService)
    {
        _context = context;
        _auditLogService = auditLogService;
        _currentUserService = currentUserService;
    }

    // =========================================================
    // GET SYSTEM SETTINGS
    // =========================================================

    public async Task<SystemSettingDto> GetAsync()
    {
        var setting = await _context.SystemSettings
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (setting == null)
        {
            setting = new SystemSetting();

            _context.SystemSettings.Add(setting);

            await _context.SaveChangesAsync();
        }

        return MapToDto(setting);
    }

    // =========================================================
    // UPDATE SYSTEM SETTINGS
    // =========================================================

    public async Task<SystemSettingDto> UpdateAsync(
        UpdateSystemSettingRequestDto request)
    {
        var setting = await _context.SystemSettings
            .FirstOrDefaultAsync();

        if (setting == null)
        {
            setting = new SystemSetting();

            _context.SystemSettings.Add(setting);
        }

        setting.SystemName =
            request.SystemName.Trim();

        setting.DefaultLanguage =
            request.DefaultLanguage.Trim();

        setting.DateTimeFormat =
            request.DateTimeFormat.Trim();

        setting.AllowUserRegistration =
            request.AllowUserRegistration;

        setting.SessionTimeoutMinutes =
            request.SessionTimeoutMinutes;

        setting.MaxFileUploadSizeMb =
            request.MaxFileUploadSizeMb;

        setting.MaintenanceMode =
            request.MaintenanceMode;

        setting.UpdatedAt =
            DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // =====================================================
        // CREATE AUDIT LOG
        // =====================================================

        var userId = _currentUserService.UserId;

        if (userId != Guid.Empty)
        {
            await _auditLogService.CreateAsync(
                userId,
                "SystemSettingsUpdated",
                "SystemSetting",
                setting.Id,
                "System settings were updated."
            );
        }

        return MapToDto(setting);
    }

    // =========================================================
    // MAPPING
    // =========================================================

    private static SystemSettingDto MapToDto(
        SystemSetting setting)
    {
        return new SystemSettingDto
        {
            Id = setting.Id,

            SystemName =
                setting.SystemName,

            DefaultLanguage =
                setting.DefaultLanguage,

            DateTimeFormat =
                setting.DateTimeFormat,

            AllowUserRegistration =
                setting.AllowUserRegistration,

            SessionTimeoutMinutes =
                setting.SessionTimeoutMinutes,

            AvailableLanguages =
                setting.AvailableLanguages,

            MaxFileUploadSizeMb =
                setting.MaxFileUploadSizeMb,

            MaintenanceMode =
                setting.MaintenanceMode,

            CreatedAt =
                setting.CreatedAt,

            UpdatedAt =
                setting.UpdatedAt
        };
    }
}
