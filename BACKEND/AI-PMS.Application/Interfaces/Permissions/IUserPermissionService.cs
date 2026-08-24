using AI_PMS.Application.DTOs.Permissions;

namespace AI_PMS.Application.Interfaces.Permissions
{
    public interface IUserPermissionService
    {
        // =========================================================
        // GET ALL PERMISSIONS FOR USER
        // =========================================================

        Task<IEnumerable<UserPermissionDto>>
            GetPermissionsByUserIdAsync(
                Guid userId);

        // =========================================================
        // GET SPECIFIC USER PERMISSION
        // =========================================================

        Task<UserPermissionDto?>
            GetUserPermissionAsync(
                Guid userId,
                Guid permissionId);

        // =========================================================
        // SET USER PERMISSION
        // =========================================================

        Task<bool>
            SetUserPermissionAsync(
                Guid userId,
                Guid permissionId,
                bool isEnabled);

        // =========================================================
        // DELETE USER PERMISSION OVERRIDE
        // =========================================================

        Task<bool>
            DeleteUserPermissionAsync(
                Guid userId,
                Guid permissionId);
    }
}
