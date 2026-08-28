namespace AI_PMS.Domain.Entities.SystemSettings;

public class SystemSetting
{
    public Guid Id { get; set; }

    // =========================================================
    // GENERAL SYSTEM INFORMATION
    // =========================================================

    public string SystemName { get; set; } = "AI-PMS";

    // Default language used when a user has not selected one.
    public string DefaultLanguage { get; set; } = "en";

    // Available languages configured by the system administrator.
    // Example:
    // en, am, fr, zh, es, ar, pt, de
    public string AvailableLanguages { get; set; } =
        "en,am,fr,zh,es,ar,pt,de";

    // =========================================================
    // THEME CONFIGURATION
    // =========================================================

    // Default system theme.
    // Example: system, light, dark
    public string DefaultTheme { get; set; } = "system";

    // Available built-in system themes.
    // Personal custom themes are stored separately per user.
    public string AvailableThemes { get; set; } =
        "system,light,dark";

    // =========================================================
    // DATE / TIME
    // =========================================================

    public string DateTimeFormat { get; set; } =
        "yyyy-MM-dd HH:mm";

    // =========================================================
    // USER MANAGEMENT
    // =========================================================

    public bool AllowUserRegistration { get; set; } = false;

    // =========================================================
    // SECURITY / SESSION
    // =========================================================

    public int SessionTimeoutMinutes { get; set; } = 60;

    // =========================================================
    // FILE MANAGEMENT
    // =========================================================

    public long MaxFileUploadSizeMb { get; set; } = 10;

    // =========================================================
    // SYSTEM OPERATION
    // =========================================================

    public bool MaintenanceMode { get; set; } = false;

    // =========================================================
    // TIMESTAMPS
    // =========================================================

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}