using AI_PMS.Application.DTOs.Contributors;

namespace AI_PMS.Application.Interfaces.Contributors
{
    public interface IContributorSubTypeService
    {
        Task<IEnumerable<ContributorSubTypeDto>>
            GetAllAsync();

        Task<IEnumerable<ContributorSubTypeDto>>
            GetActiveAsync();

        Task<IEnumerable<ContributorSubTypeDto>>
            GetByContributorTypeIdAsync(
                Guid contributorTypeId);

        Task<ContributorSubTypeDto?>
            GetByIdAsync(Guid id);

        Task<ContributorSubTypeDto?>
            CreateAsync(
                CreateContributorSubTypeDto dto);

        Task<bool>
            UpdateAsync(
                Guid id,
                UpdateContributorSubTypeDto dto);

        Task<bool>
            DeleteAsync(Guid id);
    }
}
