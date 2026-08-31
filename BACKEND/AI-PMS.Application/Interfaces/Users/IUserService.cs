
using AI_PMS.Application.DTOs.Users;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Interfaces.Users
{
    public interface IUserService
    {
        // =========================================================
        // CREATE USER
        // =========================================================

        Task<UserDto?> CreateUserAsync(
            CreateUserDto dto);

        // =========================================================
        // GET USERS
        // =========================================================

        Task<IEnumerable<UserDto>> GetAllUsersAsync();

        Task<UserDto?> GetUserByIdAsync(
            Guid id);

        // =========================================================
        // UPDATE USER
        // =========================================================

        Task<bool> UpdateUserAsync(
            Guid id,
            UpdateUserDto dto);

        // =========================================================
        // DELETE USER
        // =========================================================

        Task<bool> DeleteUserAsync(
            Guid id);

        // =========================================================
        // USER STATUS
        // =========================================================

        Task<bool> ChangeUserStatusAsync(
            Guid id,
            bool isActive);

        // =========================================================
        // USER ROLE
        // =========================================================

        Task<bool> ChangeUserRoleAsync(
            Guid id,
            Role role);

        // =========================================================
        // MY PROFILE
        // =========================================================

        Task<UserDto?> GetMyProfileAsync(
            Guid userId);

        Task<bool> UpdateMyProfileAsync(
            Guid userId,
            UpdateProfileDto dto);
    }
}

