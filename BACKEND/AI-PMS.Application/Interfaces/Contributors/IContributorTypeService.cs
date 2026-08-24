
// ============================================================
// IContributorTypeService.cs
// ============================================================

using AI_PMS.Application.DTOs.Contributors;

namespace AI_PMS.Application.Interfaces.Contributors
{
    public interface IContributorTypeService
    {
        Task<IEnumerable<ContributorTypeDto>>
            GetAllAsync();

        Task<IEnumerable<ContributorTypeDto>>
            GetActiveAsync();

        Task<ContributorTypeDto?>
            GetByIdAsync(Guid id);

        Task<ContributorTypeDto?>
            CreateAsync(CreateContributorTypeDto dto);

        Task<bool>
            UpdateAsync(
                Guid id,
                UpdateContributorTypeDto dto);

        Task<bool>
            DeleteAsync(Guid id);
    }
}

