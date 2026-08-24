using AI_PMS.Application.DTOs.Permissions;

namespace AI_PMS.Application.Interfaces.Users
{
    public interface IUserPermissionService
    {
        // User-specific Permission Overrides

        Task<IEnumerable<UserPermissionDto>>
            GetPermissionsByUserIdAsync(
                Guid userId);

        Task<UserPermissionDto?>
            GetUserPermissionAsync(
                Guid userId,
                Guid permissionId);

        Task<bool> SetUserPermissionAsync(
            Guid userId,
            Guid permissionId,
            bool isEnabled);

        Task<bool> DeleteUserPermissionAsync(
            Guid userId,
            Guid permissionId);
    }
}