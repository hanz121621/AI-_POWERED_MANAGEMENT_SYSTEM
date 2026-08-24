using AI_PMS.Domain.Entities.Teams;

namespace AI_PMS.Application.Interfaces.Repositories.Contributors
{
    public interface IContributorSubTypeRepository
    {
        Task<ContributorSubType> AddAsync(
            ContributorSubType contributorSubType);

        Task<ContributorSubType?> GetByIdAsync(
            Guid id);

        Task<ContributorSubType?> GetByNameAsync(
            Guid contributorTypeId,
            string name);

        Task<List<ContributorSubType>> GetAllAsync();

        Task<List<ContributorSubType>>
            GetByContributorTypeIdAsync(
                Guid contributorTypeId);

        Task<List<ContributorSubType>>
            GetActiveAsync();

        Task UpdateAsync(
            ContributorSubType contributorSubType);

        Task DeleteAsync(
            ContributorSubType contributorSubType);
    }
}