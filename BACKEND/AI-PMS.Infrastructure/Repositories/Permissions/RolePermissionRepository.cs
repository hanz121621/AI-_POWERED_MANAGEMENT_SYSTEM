
using AI_PMS.Application.Interfaces.Repositories.Permissions;
using AI_PMS.Domain.Entities.Permissions;
using AI_PMS.Domain.Enums;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Permissions
{
    public class RolePermissionRepository : IRolePermissionRepository
    {
        private readonly ApplicationDbContext _context;

        public RolePermissionRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // GET ALL PERMISSIONS FOR A ROLE
        // =========================================================

        public async Task<List<RolePermission>> GetByRoleAsync(
            Role role)
        {
            return await _context.RolePermissions
                .Include(x => x.Permission)
                .Where(x => x.Role == role)
                .OrderBy(x => x.Permission.Name)
                .ToListAsync();
        }

        // =========================================================
        // GET SPECIFIC ROLE PERMISSION
        // =========================================================

        public async Task<RolePermission?> GetAsync(
            Role role,
            Guid permissionId)
        {
            return await _context.RolePermissions
                .Include(x => x.Permission)
                .FirstOrDefaultAsync(x =>
                    x.Role == role &&
                    x.PermissionId == permissionId);
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<RolePermission> AddAsync(
            RolePermission rolePermission)
        {
            await _context.RolePermissions.AddAsync(rolePermission);

            await _context.SaveChangesAsync();

            return rolePermission;
        }

        // =========================================================
        // UPDATE
        // =========================================================

        public async Task UpdateAsync(
            RolePermission rolePermission)
        {
            _context.RolePermissions.Update(rolePermission);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // DELETE
        // =========================================================

        public async Task DeleteAsync(
            RolePermission rolePermission)
        {
            _context.RolePermissions.Remove(rolePermission);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // CHECK WHETHER ROLE HAS ENABLED PERMISSION
        // =========================================================

        public async Task<bool> HasPermissionAsync(
            Role role,
            Guid permissionId)
        {
            return await _context.RolePermissions
                .AnyAsync(x =>
                    x.Role == role &&
                    x.PermissionId == permissionId &&
                    x.IsEnabled);
        }

        // =========================================================
        // CHECK BY PERMISSION NAME
        // =========================================================

        public async Task<bool> HasPermissionAsync(
            Role role,
            string permissionName)
        {
            if (string.IsNullOrWhiteSpace(permissionName))
            {
                return false;
            }

            var normalizedName =
                permissionName.Trim();

            return await _context.RolePermissions
                .AnyAsync(x =>
                    x.Role == role &&
                    x.IsEnabled &&
                    x.Permission.IsActive &&
                    x.Permission.Name == normalizedName);
        }
    }
}
