using AI_PMS.Domain.Enums;
using MediatR;

namespace AI_PMS.Application.Users.Commands.CreateUser;

public class CreateUserCommand
    : IRequest<CreateUserResponse>
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string ConfirmPassword { get; set; } = string.Empty;

    public Role Role { get; set; }

    public Guid? ContributorTypeId { get; set; }

    public Guid? ContributorSubTypeId { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Bio { get; set; }

    public bool IsActive { get; set; } = true;
}
