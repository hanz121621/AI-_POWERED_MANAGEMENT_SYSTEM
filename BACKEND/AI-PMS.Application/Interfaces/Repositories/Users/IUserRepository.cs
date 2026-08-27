using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Application.Interfaces.Repositories.Users;

public interface IUserRepository
{
    Task<User> AddAsync(User user);

    Task<User?> GetByIdAsync(Guid id);

    Task<User?> GetByEmailAsync(string email);

    Task<List<User>> GetAllAsync();

    Task UpdateAsync(User user);

    Task DeleteAsync(User user);

    Task<User?> GetByPasswordResetTokenAsync(string token);

    Task<List<User>> GetActiveDevelopersAsync();

    Task<List<User>> GetActiveUsersAsync();

    Task SetActiveStatusAsync(
        Guid userId,
        bool isActive);

    // =========================================================
    // CONTRIBUTOR CLASSIFICATION
    // =========================================================
Task<bool> ContributorTypeHasSubTypesAsync(
    Guid contributorTypeId);
    
    Task<bool> ContributorTypeExistsAsync(
        Guid contributorTypeId);

    Task<bool> ContributorSubTypeExistsAsync(
        Guid contributorSubTypeId);

    Task<bool> ContributorClassificationExistsAsync(
        Guid contributorTypeId,
        Guid contributorSubTypeId);
}