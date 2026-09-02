using AI_PMS.Application.DTOs.SecuritySettings;
using AI_PMS.Application.Interfaces.Activities;
using AI_PMS.Application.Interfaces.Auth;
using AI_PMS.Application.Interfaces.SecuritySettings;
using AI_PMS.Domain.Entities.SecuritySettings;
using AI_PMS.Application.Interfaces.Repositories.SecuritySettings;

namespace AI_PMS.Application.Services.SecuritySettings;

public class SecuritySettingService : ISecuritySettingService
{
    private readonly ISecuritySettingRepository _repository;
    private readonly IAuditLogService _auditLogService;
    private readonly ICurrentUserService _currentUserService;

public SecuritySettingService(
    ISecuritySettingRepository repository,
    IAuditLogService auditLogService,
    ICurrentUserService currentUserService)
{
    _repository = repository;
    _auditLogService = auditLogService;
    _currentUserService = currentUserService;
}

    // =========================================================
    // GET
    // =========================================================

  public async Task<SecuritySettingDto> GetAsync()
{
    var setting = await _repository.GetAsync();

    if (setting == null)
    {
        setting = new SecuritySetting();

        await _repository.AddAsync(setting);
    }

    return MapToDto(setting);
}
    // =========================================================
    // UPDATE
    // =========================================================

    public async Task<SecuritySettingDto> UpdateAsync(
        UpdateSecuritySettingRequestDto request)
    {
        ValidateRequest(request);

      var setting = await _repository.GetAsync();

if (setting == null)
{
    setting = new SecuritySetting();

    await _repository.AddAsync(setting);
}

        if (setting == null)
        {
            setting = new SecuritySetting();

           
        }

        setting.PasswordComplexityEnabled =
            request.PasswordComplexityEnabled;

        setting.MinimumPasswordLength =
            request.MinimumPasswordLength;

        setting.RequireUppercase =
            request.RequireUppercase;

        setting.RequireLowercase =
            request.RequireLowercase;

        setting.RequireNumber =
            request.RequireNumber;

        setting.RequireSpecialCharacter =
            request.RequireSpecialCharacter;

        setting.SessionTimeoutMinutes =
            request.SessionTimeoutMinutes;

        setting.MaxLoginAttempts =
            request.MaxLoginAttempts;

        setting.AccountLockoutEnabled =
            request.AccountLockoutEnabled;

        setting.AccountLockoutMinutes =
            request.AccountLockoutMinutes;

        setting.TwoFactorAuthenticationEnabled =
            request.TwoFactorAuthenticationEnabled;

        setting.ApiSecurityEnabled =
            request.ApiSecurityEnabled;

        setting.UpdatedAt = DateTime.UtcNow;

     await _repository.UpdateAsync(setting);

        // =====================================================
        // AUDIT LOG
        // =====================================================

        var userId = _currentUserService.UserId;

        if (userId != Guid.Empty)
        {
            await _auditLogService.CreateAsync(
                userId,
                "SecuritySettingsUpdated",
                "SecuritySetting",
                setting.Id,
                "Security settings were updated.");
        }

        return MapToDto(setting);
    }

    // =========================================================
    // VALIDATION
    // =========================================================

    private static void ValidateRequest(
        UpdateSecuritySettingRequestDto request)
    {
        if (request.MinimumPasswordLength <= 0)
        {
            throw new ArgumentException(
                "Invalid security configuration.");
        }

        if (request.SessionTimeoutMinutes <= 0)
        {
            throw new ArgumentException(
                "Invalid security configuration.");
        }

        if (request.MaxLoginAttempts <= 0)
        {
            throw new ArgumentException(
                "Invalid security configuration.");
        }

        if (request.AccountLockoutEnabled &&
            request.AccountLockoutMinutes <= 0)
        {
            throw new ArgumentException(
                "Invalid security configuration.");
        }

        if (request.PasswordComplexityEnabled &&
            !request.RequireUppercase &&
            !request.RequireLowercase &&
            !request.RequireNumber &&
            !request.RequireSpecialCharacter)
        {
            throw new ArgumentException(
                "Password complexity requires at least one complexity rule.");
        }
    }

    // =========================================================
    // MAPPING
    // =========================================================

    private static SecuritySettingDto MapToDto(
        SecuritySetting setting)
    {
        return new SecuritySettingDto
        {
            Id = setting.Id,

            PasswordComplexityEnabled =
                setting.PasswordComplexityEnabled,

            MinimumPasswordLength =
                setting.MinimumPasswordLength,

            RequireUppercase =
                setting.RequireUppercase,

            RequireLowercase =
                setting.RequireLowercase,

            RequireNumber =
                setting.RequireNumber,

            RequireSpecialCharacter =
                setting.RequireSpecialCharacter,

            SessionTimeoutMinutes =
                setting.SessionTimeoutMinutes,

            MaxLoginAttempts =
                setting.MaxLoginAttempts,

            AccountLockoutEnabled =
                setting.AccountLockoutEnabled,

            AccountLockoutMinutes =
                setting.AccountLockoutMinutes,

            TwoFactorAuthenticationEnabled =
                setting.TwoFactorAuthenticationEnabled,

            ApiSecurityEnabled =
                setting.ApiSecurityEnabled,

            CreatedAt =
                setting.CreatedAt,

            UpdatedAt =
                setting.UpdatedAt
        };
    }
}
