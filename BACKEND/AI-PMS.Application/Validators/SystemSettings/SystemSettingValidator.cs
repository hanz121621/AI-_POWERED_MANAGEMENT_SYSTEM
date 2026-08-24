using AI_PMS.Application.DTOs.SystemSettings;

namespace AI_PMS.Application.Validators.SystemSettings;

public class SystemSettingValidator
{
    public void Validate(UpdateSystemSettingRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.SystemName))
            throw new ArgumentException("System name is required.");

        if (string.IsNullOrWhiteSpace(request.DefaultLanguage))
            throw new ArgumentException("Default language is required.");

        if (string.IsNullOrWhiteSpace(request.DateTimeFormat))
            throw new ArgumentException("Date and time format is required.");

        if (request.SessionTimeoutMinutes <= 0)
            throw new ArgumentException(
                "Session timeout must be greater than zero.");

        if (request.MaxFileUploadSizeMb <= 0)
            throw new ArgumentException(
                "Maximum file upload size must be greater than zero.");
    }
}