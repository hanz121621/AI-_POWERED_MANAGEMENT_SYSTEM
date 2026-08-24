using AI_PMS.Application.Interfaces.Repositories.Permissions;
using AI_PMS.Domain.Entities.Permissions;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.Repositories.Permissions
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly ApplicationDbContext _context;

        public PermissionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // CREATE
        // =========================================================

        public async Task<Permission> AddAsync(Permission permission)
        {
            await _context.Permissions.AddAsync(permission);
            await _context.SaveChangesAsync();

            return permission;
        }

        // =========================================================
        // GET BY ID
        // =========================================================

        public async Task<Permission?> GetByIdAsync(Guid id)
        {
            return await _context.Permissions
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        // =========================================================
        // GET BY NAME
        // =========================================================

        public async Task<Permission?> GetByNameAsync(string name)
        {
            string normalizedName = name.Trim().ToLower();

            return await _context.Permissions
                .FirstOrDefaultAsync(p =>
                    p.Name.ToLower() == normalizedName);
        }

        // =========================================================
        // GET ALL
        // =========================================================

        public async Task<List<Permission>> GetAllAsync()
        {
            return await _context.Permissions
                .OrderBy(p => p.Name)
                .ToListAsync();
        }

        // =========================================================
        // GET ACTIVE
        // =========================================================

        public async Task<List<Permission>> GetActiveAsync()
        {
            return await _context.Permissions
                .Where(p => p.IsActive)
                .OrderBy(p => p.Name)
                .ToListAsync();
        }

        // =========================================================
        // UPDATE
        // =========================================================

        public async Task UpdateAsync(Permission permission)
        {
            _context.Permissions.Update(permission);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // DELETE
        // =========================================================

        public async Task DeleteAsync(Permission permission)
        {
            _context.Permissions.Remove(permission);

            await _context.SaveChangesAsync();
        }
    }
}