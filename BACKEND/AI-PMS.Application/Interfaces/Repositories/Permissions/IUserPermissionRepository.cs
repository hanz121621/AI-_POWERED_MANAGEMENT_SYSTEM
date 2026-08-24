using AI_PMS.Domain.Entities.Permissions;

namespace AI_PMS.Application.Interfaces.Repositories.Permissions;

public interface IUserPermissionRepository
{
    Task<UserPermission> AddAsync(UserPermission userPermission);
    Task<List<UserPermission>> GetByUserIdAsync(Guid userId);
    Task<UserPermission?> GetAsync(Guid userId, Guid permissionId);
    Task UpdateAsync(UserPermission userPermission);
    Task DeleteAsync(UserPermission userPermission);
}
