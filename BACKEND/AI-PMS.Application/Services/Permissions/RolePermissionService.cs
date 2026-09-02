using AI_PMS.Application.DTOs.Permissions;
using AI_PMS.Application.Interfaces.Permissions;

using AI_PMS.Domain.Entities.Permissions;

using AI_PMS.Domain.Enums;

using AI_PMS.Application.Interfaces.Repositories.Permissions;



namespace AI_PMS.Application.Services.Permissions
{
    public class RolePermissionService : IRolePermissionService
    {
        private readonly IRolePermissionRepository _rolePermissionRepository;
        private readonly IPermissionRepository _permissionRepository;

        public RolePermissionService(
            IRolePermissionRepository rolePermissionRepository,
            IPermissionRepository permissionRepository)
        {
            _rolePermissionRepository =
                rolePermissionRepository;

            _permissionRepository =
                permissionRepository;
        }

        // =========================================================
        // GET PERMISSIONS BY ROLE
        // =========================================================

        public async Task<IEnumerable<RolePermissionDto>>
            GetPermissionsByRoleAsync(Role role)
        {
            var permissions =
                await _rolePermissionRepository
                    .GetByRoleAsync(role);

            return permissions.Select(MapToDto);
        }

        // =========================================================
        // GET SPECIFIC ROLE PERMISSION
        // =========================================================

        public async Task<RolePermissionDto?>
            GetRolePermissionAsync(
                Role role,
                Guid permissionId)
        {
            var rolePermission =
                await _rolePermissionRepository
                    .GetAsync(role, permissionId);

            return rolePermission == null
                ? null
                : MapToDto(rolePermission);
        }

        // =========================================================
        // SET ROLE PERMISSION
        // =========================================================

        public async Task<bool> SetRolePermissionAsync(
            Role role,
            Guid permissionId,
            bool isEnabled)
        {
            var permission =
                await _permissionRepository
                    .GetByIdAsync(permissionId);

            if (permission == null)
            {
                throw new InvalidOperationException(
                    "Permission not found.");
            }

            if (!permission.IsActive)
            {
                throw new InvalidOperationException(
                    "Cannot assign an inactive permission.");
            }

            var existing =
                await _rolePermissionRepository
                    .GetAsync(role, permissionId);

            // -----------------------------------------------------
            // CREATE
            // -----------------------------------------------------

            if (existing == null)
            {
                var rolePermission = new RolePermission
                {
                    Id = Guid.NewGuid(),
                    Role = role,
                    PermissionId = permissionId,
                    IsEnabled = isEnabled,
                    CreatedAt = DateTime.UtcNow
                };

                await _rolePermissionRepository
                    .AddAsync(rolePermission);

                return true;
            }

            // -----------------------------------------------------
            // NO CHANGE
            // -----------------------------------------------------

            if (existing.IsEnabled == isEnabled)
            {
                throw new InvalidOperationException(
                    isEnabled
                        ? "This role already has this permission enabled."
                        : "This role already has this permission disabled.");
            }

            // -----------------------------------------------------
            // UPDATE
            // -----------------------------------------------------

            existing.IsEnabled = isEnabled;
            existing.UpdatedAt = DateTime.UtcNow;

            await _rolePermissionRepository
                .UpdateAsync(existing);

            return true;
        }

        // =========================================================
        // DELETE ROLE PERMISSION
        // =========================================================

        public async Task<bool> DeleteRolePermissionAsync(
            Role role,
            Guid permissionId)
        {
            var rolePermission =
                await _rolePermissionRepository
                    .GetAsync(role, permissionId);

            if (rolePermission == null)
                return false;

            await _rolePermissionRepository
                .DeleteAsync(rolePermission);

            return true;
        }

        // =========================================================
        // ENTITY → DTO
        // =========================================================

        private static RolePermissionDto MapToDto(
            RolePermission rolePermission)
        {
            return new RolePermissionDto
            {
                Id = rolePermission.Id,
                Role = rolePermission.Role,
                PermissionId = rolePermission.PermissionId,
                PermissionName =
                    rolePermission.Permission?.Name
                    ?? string.Empty,
                IsEnabled = rolePermission.IsEnabled,
                CreatedAt = rolePermission.CreatedAt,
                UpdatedAt = rolePermission.UpdatedAt
            };
        }
    }
}
