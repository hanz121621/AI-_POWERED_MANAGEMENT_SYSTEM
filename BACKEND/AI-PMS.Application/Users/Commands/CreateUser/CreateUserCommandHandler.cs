using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Domain.Entities.Users;
using AI_PMS.Domain.Enums;
using AI_PMS.Application.Interfaces.Security;
using MediatR;

namespace AI_PMS.Application.Users.Commands.CreateUser;

public class CreateUserCommandHandler
    : IRequestHandler<CreateUserCommand, CreateUserResponse>
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;

    public CreateUserCommandHandler(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<CreateUserResponse> Handle(
        CreateUserCommand request,
        CancellationToken cancellationToken)
    {
        // =========================================================
        // VALIDATION
        // =========================================================

        if (string.IsNullOrWhiteSpace(request.FullName))
            throw new ArgumentException(
                "Full name is required.");

        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException(
                "Email is required.");

        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException(
                "Password is required.");

        if (request.Password != request.ConfirmPassword)
            throw new ArgumentException(
                "Passwords do not match.");

        // =========================================================
        // NORMALIZE EMAIL
        // =========================================================

        var email =
            request.Email
                .Trim()
                .ToLowerInvariant();

        // =========================================================
        // VALIDATE ROLE
        // =========================================================

        if (!Enum.IsDefined(
                typeof(Role),
                request.Role))
        {
            throw new ArgumentException(
                "Invalid user role.");
        }

        // =========================================================
        // CONTRIBUTOR VALIDATION
        // =========================================================

        if (request.Role == Role.Contributor)
        {
            if (!request.ContributorTypeId.HasValue)
            {
                throw new ArgumentException(
                    "Contributor type is required.");
            }
        }
        else
        {
            request.ContributorTypeId = null;
            request.ContributorSubTypeId = null;
        }

        // =========================================================
        // CHECK EMAIL
        // =========================================================

        var existingUser =
            await _userRepository
                .GetByEmailAsync(email);

        if (existingUser != null)
        {
            throw new InvalidOperationException(
                "A user with this email already exists.");
        }

        // =========================================================
        // CREATE USER
        // =========================================================

        var user = new User
        {
            Id = Guid.NewGuid(),

            FullName =
                request.FullName.Trim(),

            Email = email,

            Role = request.Role,

            ContributorTypeId =
                request.ContributorTypeId,

            ContributorSubTypeId =
                request.ContributorSubTypeId,

            PhoneNumber =
                string.IsNullOrWhiteSpace(
                    request.PhoneNumber)
                    ? null
                    : request.PhoneNumber.Trim(),

            Bio =
                string.IsNullOrWhiteSpace(
                    request.Bio)
                    ? null
                    : request.Bio.Trim(),

            IsActive =
                request.IsActive,

            CreatedAt =
                DateTime.UtcNow
        };

        // =========================================================
        // HASH PASSWORD
        // =========================================================

        user.PasswordHash =
            _passwordHasher.HashPassword(
                request.Password);

        // =========================================================
        // SAVE
        // =========================================================

        await _userRepository.AddAsync(user);

        // =========================================================
        // RESPONSE
        // =========================================================

        return new CreateUserResponse
        {
            Id = user.Id,

            FullName =
                user.FullName,

            Email =
                user.Email,

            Role =
                user.Role,

            ContributorTypeId =
                user.ContributorTypeId,

            ContributorSubTypeId =
                user.ContributorSubTypeId,

            PhoneNumber =
                user.PhoneNumber,

            Bio =
                user.Bio,

            IsActive =
                user.IsActive,

            Message =
                "User created successfully."
        };
    }
}
