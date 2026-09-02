using AI_PMS.Domain.Entities.Permissions;

namespace AI_PMS.Application.Interfaces.Repositories.Permissions;

public interface IPermissionRepository
{
    Task<Permission> AddAsync(Permission permission);
    Task<Permission?> GetByIdAsync(Guid id);
    Task<Permission?> GetByNameAsync(string name);
    Task<List<Permission>> GetAllAsync();
    Task<List<Permission>> GetActiveAsync();
    Task UpdateAsync(Permission permission);
    Task DeleteAsync(Permission permission);
}

