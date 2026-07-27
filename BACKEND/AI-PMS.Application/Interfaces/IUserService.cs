using AI_PMS.Application.DTOs.Users;

namespace AI_PMS.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto> CreateUserAsync(CreateUserDto dto);

        Task<UserDto?> GetUserByIdAsync(Guid id);

        Task<IEnumerable<UserDto>> GetAllUsersAsync();

        Task<UserDto?> UpdateUserAsync(Guid id, UpdateUserDto dto);

        Task<bool> DeleteUserAsync(Guid id);

        Task<UserProfileDto?> GetUserProfileAsync(Guid id);

        Task<bool> AssignRoleAsync(AssignRoleDto dto);

        Task<bool> ActivateUserAsync(ActivateUserDto dto);

        Task<bool> DeactivateUserAsync(DeactivateUserDto dto);
    }
}