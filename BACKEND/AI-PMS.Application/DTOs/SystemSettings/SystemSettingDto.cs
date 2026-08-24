namespace AI_PMS.Application.DTOs.SystemSettings;

public class SystemSettingDto
{
    public Guid Id { get; set; }

    public string SystemName { get; set; } = string.Empty;

    public string DefaultLanguage { get; set; } = string.Empty;

    public string DateTimeFormat { get; set; } = string.Empty;

    public bool AllowUserRegistration { get; set; }

    public int SessionTimeoutMinutes { get; set; }

    public long MaxFileUploadSizeMb { get; set; }

    public bool MaintenanceMode { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}