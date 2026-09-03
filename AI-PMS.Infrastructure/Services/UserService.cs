using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interface;
using AI_PMS.Application.Interfaces;
using AI_PMS.Domain.Entities;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtTokenService _jwtTokenService;


public UserService(
    IUserRepository userRepository,
    IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
    }

    // ============================================================
    // GET ALL USERS
    // ============================================================

    public async Task<List<UserDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        var users = await _userRepository.GetAllAsync(
            cancellationToken);

        return users.Select(MapToDto).ToList();
    }

    // ============================================================
    // GET USER BY ID
    // ============================================================

    public async Task<UserDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByIdAsync(
            id,
            cancellationToken);

        return user == null ? null : MapToDto(user);
    }

    // ============================================================
    // REGISTER
    // ============================================================

    public async Task<UserDto> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.FirstName))
        {
            throw new ArgumentException(
                "First name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.LastName))
        {
            throw new ArgumentException(
                "Last name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            throw new ArgumentException(
                "Email is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            throw new ArgumentException(
                "Password is required.");
        }

        if (request.Password.Length < 6)
        {
            throw new ArgumentException(
                "Password must be at least 6 characters.");
        }

        var email = request.Email.Trim().ToLowerInvariant();

        var existingUser =
            await _userRepository.GetByEmailAsync(
                email,
                cancellationToken);

        if (existingUser != null)
        {
            throw new InvalidOperationException(
                "A user with this email already exists.");
        }

        // --------------------------------------------------------
        // ROLE
        // --------------------------------------------------------

        if (!Enum.TryParse<Role>(
                request.Role,
                true,
                out var role))
        {
            throw new ArgumentException(
                "Invalid role. Use Developer, Staff, or TeamLeader.");
        }

        // --------------------------------------------------------
        // PASSWORD
        // --------------------------------------------------------
        // Temporary hashing implementation.
        // This matches the existing users created by the
        // previous version of this service.
        //
        // We can replace this with BCrypt/PBKDF2 later.
        // --------------------------------------------------------

        var passwordHash =
            Convert.ToBase64String(
                System.Text.Encoding.UTF8.GetBytes(
                    request.Password));

        // --------------------------------------------------------
        // CREATE USER
        // --------------------------------------------------------

        var user = new User
        {
            Id = Guid.NewGuid(),

            FirstName = request.FirstName.Trim(),

            LastName = request.LastName.Trim(),

            Email = email,

            PasswordHash = passwordHash,

            Role = role,

            OrganizationId = request.OrganizationId
        };

        await _userRepository.AddAsync(
            user,
            cancellationToken);

        return MapToDto(user);
    }

    // ============================================================
    // LOGIN
    // ============================================================

    public async Task<LoginResponse?> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return null;
        }

        var email =
            request.Email.Trim().ToLowerInvariant();

        var user =
            await _userRepository.GetByEmailAsync(
                email,
                cancellationToken);

        if (user == null)
        {
            return null;
        }

        // --------------------------------------------------------
        // VERIFY PASSWORD
        // --------------------------------------------------------

        var passwordHash =
            Convert.ToBase64String(
                System.Text.Encoding.UTF8.GetBytes(
                    request.Password));

        if (user.PasswordHash != passwordHash)
        {
            return null;
        }

        // --------------------------------------------------------
        // GENERATE REAL JWT
        // --------------------------------------------------------

        var token =
            _jwtTokenService.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            User = MapToDto(user)
        };
    }

    // ============================================================
    // MAP USER TO DTO
    // ============================================================

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,

            FirstName = user.FirstName,

            LastName = user.LastName,

            Email = user.Email,

            Role = user.Role.ToString(),

            OrganizationId = user.OrganizationId
        };
    }


}
