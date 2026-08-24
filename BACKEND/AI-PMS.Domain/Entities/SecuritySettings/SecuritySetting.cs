using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.SecuritySettings;

public class SecuritySetting
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public bool PasswordComplexityEnabled { get; set; }

    [Required]
    public int MinimumPasswordLength { get; set; }

    [Required]
    public bool RequireUppercase { get; set; }

    [Required]
    public bool RequireLowercase { get; set; }

    [Required]
    public bool RequireNumber { get; set; }

    [Required]
    public bool RequireSpecialCharacter { get; set; }

    [Required]
    public int SessionTimeoutMinutes { get; set; }

    [Required]
    public int MaxLoginAttempts { get; set; }

    [Required]
    public bool AccountLockoutEnabled { get; set; }

    [Required]
    public int AccountLockoutMinutes { get; set; }

    [Required]
    public bool TwoFactorAuthenticationEnabled { get; set; }

    [Required]
    public bool ApiSecurityEnabled { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}