namespace AI_PMS.Application.DTOs.SecuritySettings;

public class SecuritySettingDto
{
    public Guid Id { get; set; }

    public bool PasswordComplexityEnabled { get; set; }

    public int MinimumPasswordLength { get; set; }

    public bool RequireUppercase { get; set; }

    public bool RequireLowercase { get; set; }

    public bool RequireNumber { get; set; }

    public bool RequireSpecialCharacter { get; set; }

    public int SessionTimeoutMinutes { get; set; }

    public int MaxLoginAttempts { get; set; }

    public bool AccountLockoutEnabled { get; set; }

    public int AccountLockoutMinutes { get; set; }

    public bool TwoFactorAuthenticationEnabled { get; set; }

    public bool ApiSecurityEnabled { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
