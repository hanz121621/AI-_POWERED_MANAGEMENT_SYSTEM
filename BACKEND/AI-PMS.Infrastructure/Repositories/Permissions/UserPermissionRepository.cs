
using AI_PMS.Application.Interfaces.Repositories.Permissions;
using AI_PMS.Domain.Entities.Permissions;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


namespace AI_PMS.Infrastructure.Repositories.Permissions
{
    public class UserPermissionRepository
        : IUserPermissionRepository
    {
        private readonly ApplicationDbContext _context;

        public UserPermissionRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<UserPermission> AddAsync(
            UserPermission userPermission)
        {
            await _context.UserPermissions.AddAsync(
                userPermission);

            await _context.SaveChangesAsync();

            return userPermission;
        }

        // =========================================================
        // GET BY USER
        // =========================================================

        public async Task<List<UserPermission>>
            GetByUserIdAsync(Guid userId)
        {
            return await _context.UserPermissions
                .Include(x => x.User)
                .Include(x => x.Permission)
                .Where(x => x.UserId == userId)
                .OrderBy(x => x.Permission.Name)
                .ToListAsync();
        }

        // =========================================================
        // GET SPECIFIC
        // =========================================================

        public async Task<UserPermission?> GetAsync(
            Guid userId,
            Guid permissionId)
        {
            return await _context.UserPermissions
                .Include(x => x.User)
                .Include(x => x.Permission)
                .FirstOrDefaultAsync(x =>
                    x.UserId == userId &&
                    x.PermissionId == permissionId);
        }

        // =========================================================
        // UPDATE
        // =========================================================

        public async Task UpdateAsync(
            UserPermission userPermission)
        {
            _context.UserPermissions.Update(
                userPermission);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // DELETE
        // =========================================================

        public async Task DeleteAsync(
            UserPermission userPermission)
        {
            _context.UserPermissions.Remove(
                userPermission);

            await _context.SaveChangesAsync();
        }
    }
}
