using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.SecuritySettings;

public class UpdateSecuritySettingRequestDto
{
    public bool PasswordComplexityEnabled { get; set; }

    [Range(1, int.MaxValue)]
    public int MinimumPasswordLength { get; set; }

    public bool RequireUppercase { get; set; }

    public bool RequireLowercase { get; set; }

    public bool RequireNumber { get; set; }

    public bool RequireSpecialCharacter { get; set; }

    [Range(1, int.MaxValue)]
    public int SessionTimeoutMinutes { get; set; }

    [Range(1, int.MaxValue)]
    public int MaxLoginAttempts { get; set; }

    public bool AccountLockoutEnabled { get; set; }

    [Range(1, int.MaxValue)]
    public int AccountLockoutMinutes { get; set; }

    public bool TwoFactorAuthenticationEnabled { get; set; }

    public bool ApiSecurityEnabled { get; set; }
}
