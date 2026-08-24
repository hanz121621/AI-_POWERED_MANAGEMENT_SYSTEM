namespace AI_PMS.Domain.Entities.SystemSettings;

public class SystemSetting
{
    public Guid Id { get; set; }

    // General system information
    public string SystemName { get; set; } = "AI-PMS";

    public string DefaultLanguage { get; set; } = "en";

    public string DateTimeFormat { get; set; } = "yyyy-MM-dd HH:mm";

    // User management
    public bool AllowUserRegistration { get; set; } = false;

    // Security/session
    public int SessionTimeoutMinutes { get; set; } = 60;

    // File management
    public long MaxFileUploadSizeMb { get; set; } = 10;

    // System operation
    public bool MaintenanceMode { get; set; } = false;

    // Audit/general timestamps
    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}