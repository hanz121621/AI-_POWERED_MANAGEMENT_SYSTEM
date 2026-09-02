using AI_PMS.Domain.Entities.Permissions;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Interfaces.Repositories.Permissions;

public interface IRolePermissionRepository
{
    // =========================================================
    // GET ALL PERMISSIONS FOR ROLE
    // =========================================================

    Task<List<RolePermission>> GetByRoleAsync(
        Role role);

    // =========================================================
    // GET SPECIFIC ROLE PERMISSION
    // =========================================================

    Task<RolePermission?> GetAsync(
        Role role,
        Guid permissionId);

    // =========================================================
    // CREATE
    // =========================================================

    Task<RolePermission> AddAsync(
        RolePermission rolePermission);

    // =========================================================
    // UPDATE
    // =========================================================

    Task UpdateAsync(
        RolePermission rolePermission);

    // =========================================================
    // DELETE
    // =========================================================

    Task DeleteAsync(
        RolePermission rolePermission);

    // =========================================================
    // CHECK PERMISSION
    // =========================================================

    Task<bool> HasPermissionAsync(
        Role role,
        Guid permissionId);

    Task<bool> HasPermissionAsync(
        Role role,
        string permissionName);
}
