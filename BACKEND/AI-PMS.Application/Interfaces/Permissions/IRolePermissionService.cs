using AI_PMS.Application.DTOs.Permissions;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Interfaces.Permissions
{
    public interface IRolePermissionService
    {
        // Role Permission Management

        Task<IEnumerable<RolePermissionDto>>
            GetPermissionsByRoleAsync(Role role);

        Task<RolePermissionDto?>
            GetRolePermissionAsync(
                Role role,
                Guid permissionId);

        Task<bool> SetRolePermissionAsync(
            Role role,
            Guid permissionId,
            bool isEnabled);

        Task<bool> DeleteRolePermissionAsync(
            Role role,
            Guid permissionId);
    }
}
