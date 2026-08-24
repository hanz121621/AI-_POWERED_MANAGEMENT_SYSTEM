using AI_PMS.Application.DTOs.SystemSettings;
using FluentValidation;

namespace AI_PMS.Application.Validators.SystemSettings;

public class UpdateSystemSettingValidator
    : AbstractValidator<UpdateSystemSettingRequestDto>
{
    public UpdateSystemSettingValidator()
    {
        RuleFor(x => x.SystemName)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.DefaultLanguage)
            .NotEmpty()
            .MaximumLength(20);

        RuleFor(x => x.DateTimeFormat)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.SessionTimeoutMinutes)
            .GreaterThan(0);

        RuleFor(x => x.MaxFileUploadSizeMb)
            .GreaterThan(0);
    }
}