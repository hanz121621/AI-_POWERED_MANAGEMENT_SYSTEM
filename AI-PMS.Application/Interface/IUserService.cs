using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interface;

public interface IUserService
{
    Task<List<UserDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<UserDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<UserDto> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default);

    Task<LoginResponse?> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default);
}