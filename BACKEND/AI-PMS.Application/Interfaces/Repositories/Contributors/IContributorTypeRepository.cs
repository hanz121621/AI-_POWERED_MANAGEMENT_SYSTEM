using AI_PMS.Domain.Entities.Teams;

namespace AI_PMS.Application.Interfaces.Repositories.Contributors;

public interface IContributorTypeRepository
{
    Task<ContributorType> AddAsync(ContributorType contributorType);
    Task<ContributorType?> GetByIdAsync(Guid id);
    Task<ContributorType?> GetByNameAsync(string name);
    Task<List<ContributorType>> GetAllAsync();
    Task<List<ContributorType>> GetActiveAsync();
    Task UpdateAsync(ContributorType contributorType);
    Task DeleteAsync(ContributorType contributorType);
}

