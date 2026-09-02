
// ============================================================
// ContributorTypeService.cs
// ============================================================

using AI_PMS.Application.DTOs.Contributors;
using AI_PMS.Application.Interfaces.Contributors;
using AI_PMS.Domain.Entities.Teams;
using AI_PMS.Application.Interfaces.Repositories.Contributors;


namespace AI_PMS.Application.Services.Contributors
{
    public class ContributorTypeService : IContributorTypeService
    {
        private readonly IContributorTypeRepository _repository;

        public ContributorTypeService(
            IContributorTypeRepository repository)
        {
            _repository = repository;
        }

        // =====================================================
        // GET ALL
        // =====================================================

        public async Task<IEnumerable<ContributorTypeDto>>
            GetAllAsync()
        {
            var types =
                await _repository.GetAllAsync();

            return types.Select(MapToDto);
        }

        // =====================================================
        // GET ACTIVE
        // =====================================================

        public async Task<IEnumerable<ContributorTypeDto>>
            GetActiveAsync()
        {
            var types =
                await _repository.GetActiveAsync();

            return types.Select(MapToDto);
        }

        // =====================================================
        // GET BY ID
        // =====================================================

        public async Task<ContributorTypeDto?>
            GetByIdAsync(Guid id)
        {
            var type =
                await _repository.GetByIdAsync(id);

            if (type == null)
                return null;

            return MapToDto(type);
        }

        // =====================================================
        // CREATE
        // =====================================================

        public async Task<ContributorTypeDto?>
            CreateAsync(
                CreateContributorTypeDto dto)
        {
           var name = dto.Name?.Trim();

if (string.IsNullOrWhiteSpace(name))
{
    throw new InvalidOperationException(
        "Contributor type name is required.");
}

            var existing =
                await _repository.GetByNameAsync(name);

            if (existing != null)
                return null;

            var type = new ContributorType
            {
                Id = Guid.NewGuid(),

                Name = name,

                Description =
                    string.IsNullOrWhiteSpace(dto.Description)
                        ? null
                        : dto.Description.Trim(),

                IsActive = true,

                CreatedAt = DateTime.UtcNow
            };

            var created =
                await _repository.AddAsync(type);

            return MapToDto(created);
        }

        // =====================================================
        // UPDATE
        // =====================================================

        public async Task<bool>
            UpdateAsync(
                Guid id,
                UpdateContributorTypeDto dto)
        {
            var type =
                await _repository.GetByIdAsync(id);

            if (type == null)
                return false;

            var name = dto.Name?.Trim();

if (string.IsNullOrWhiteSpace(name))
{
    throw new InvalidOperationException(
        "Contributor type name is required.");
}

            var existing =
                await _repository.GetByNameAsync(name);

            if (existing != null &&
                existing.Id != id)
            {
                throw new InvalidOperationException(
                    "A contributor type with this name already exists.");
            }

            type.Name = name;

            type.Description =
                string.IsNullOrWhiteSpace(dto.Description)
                    ? null
                    : dto.Description.Trim();

            type.IsActive =
                dto.IsActive;

            type.UpdatedAt =
                DateTime.UtcNow;

            await _repository.UpdateAsync(type);

            return true;
        }

        // =====================================================
        // DELETE
        // =====================================================

        public async Task<bool>
            DeleteAsync(Guid id)
        {
            var type =
                await _repository.GetByIdAsync(id);

            if (type == null)
                return false;

            // Do not delete a type that still contains
            // contributor subtypes.
            if (type.SubTypes.Any())
            {
                throw new InvalidOperationException(
                    "This contributor type cannot be deleted because it still contains contributor subtypes.");
            }

            // Do not delete a type currently assigned
            // to team members.
            if (type.TeamMembers.Any())
            {
                throw new InvalidOperationException(
                    "This contributor type cannot be deleted because it is currently assigned to team members.");
            }

            await _repository.DeleteAsync(type);

            return true;
        }

        // =====================================================
        // ENTITY → DTO
        // =====================================================

        private static ContributorTypeDto MapToDto(
            ContributorType type)
        {
            return new ContributorTypeDto
            {
                Id = type.Id,

                Name = type.Name,

                Description = type.Description,

                IsActive = type.IsActive,

                CreatedAt = type.CreatedAt,

                UpdatedAt = type.UpdatedAt,

                SubTypeCount =
                    type.SubTypes?.Count ?? 0
            };
        }
    }

}
