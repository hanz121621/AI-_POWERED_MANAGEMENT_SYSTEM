using AI_PMS.Application.DTOs.Contributors;
using AI_PMS.Application.Interfaces.Contributors;
using AI_PMS.Application.Interfaces.Repositories.Contributors;
using AI_PMS.Domain.Entities.Teams;

namespace AI_PMS.Application.Services.Contributors

{
    public class ContributorSubTypeService
        : IContributorSubTypeService
    {
        private readonly IContributorSubTypeRepository
            _subTypeRepository;

        private readonly IContributorTypeRepository
            _typeRepository;

        public ContributorSubTypeService(
            IContributorSubTypeRepository subTypeRepository,
            IContributorTypeRepository typeRepository)
        {
            _subTypeRepository =
                subTypeRepository;

            _typeRepository =
                typeRepository;
        }

        // ============================================================
        // GET ALL
        // ============================================================

        public async Task<IEnumerable<ContributorSubTypeDto>>
            GetAllAsync()
        {
            var subTypes =
                await _subTypeRepository
                    .GetAllAsync();

            return subTypes
                .Select(MapToDto);
        }

        // ============================================================
        // GET ACTIVE
        // ============================================================

        public async Task<IEnumerable<ContributorSubTypeDto>>
            GetActiveAsync()
        {
            var subTypes =
                await _subTypeRepository
                    .GetActiveAsync();

            return subTypes
                .Select(MapToDto);
        }

        // ============================================================
        // GET BY CONTRIBUTOR TYPE
        // ============================================================

        public async Task<IEnumerable<ContributorSubTypeDto>>
            GetByContributorTypeIdAsync(
                Guid contributorTypeId)
        {
            var type =
                await _typeRepository
                    .GetByIdAsync(
                        contributorTypeId);

            if (type == null)
            {
                throw new KeyNotFoundException(
                    "Contributor type not found.");
            }

            var subTypes =
                await _subTypeRepository
                    .GetByContributorTypeIdAsync(
                        contributorTypeId);

            return subTypes
                .Select(MapToDto);
        }

        // ============================================================
        // GET BY ID
        // ============================================================

        public async Task<ContributorSubTypeDto?>
            GetByIdAsync(Guid id)
        {
            var subType =
                await _subTypeRepository
                    .GetByIdAsync(id);

            if (subType == null)
            {
                return null;
            }

            return MapToDto(subType);
        }

        // ============================================================
        // CREATE
        //
        // Example:
        //
        // ContributorTypeId = Developer GUID
        // Name = "DevOps Engineer"
        //
        // Backend creates:
        //
        // Id = NEW GUID
        // Name = "DevOps Engineer"
        // ContributorTypeId = Developer GUID
        //
        // The client NEVER supplies the Id.
        // ============================================================

        public async Task<ContributorSubTypeDto?>
            CreateAsync(
                CreateContributorSubTypeDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(
                    nameof(dto));
            }

            // --------------------------------------------------------
            // Validate contributor type
            // --------------------------------------------------------

            var type =
                await _typeRepository
                    .GetByIdAsync(
                        dto.ContributorTypeId);

            if (type == null)
            {
                throw new KeyNotFoundException(
                    "Contributor type not found.");
            }

            // --------------------------------------------------------
            // Contributor type must be active
            // --------------------------------------------------------

            if (!type.IsActive)
            {
                throw new InvalidOperationException(
                    "Cannot create a contributor subtype under an inactive contributor type.");
            }

            // --------------------------------------------------------
            // Validate name
            // --------------------------------------------------------

            var name =
                dto.Name?.Trim();

            if (string.IsNullOrWhiteSpace(name))
            {
                throw new InvalidOperationException(
                    "Contributor subtype name is required.");
            }

            // --------------------------------------------------------
            // Prevent duplicate subtype names
            // under the same contributor type.
            //
            // Example:
            //
            // Developer
            //   Backend Developer
            //
            // Cannot create another:
            //   backend developer
            // --------------------------------------------------------

            var existing =
                await _subTypeRepository
                    .GetByNameAsync(
                        dto.ContributorTypeId,
                        name);

            if (existing != null)
            {
                return null;
            }

            // --------------------------------------------------------
            // CREATE ENTITY
            //
            // IMPORTANT:
            // Do NOT set Id here.
            //
            // ContributorSubType entity contains:
            //
            // public Guid Id { get; set; } = Guid.NewGuid();
            //
            // Therefore the backend automatically creates the Guid.
            // --------------------------------------------------------

            var subType =
                new ContributorSubType
                {
                    Name = name,

                    Description =
                        string.IsNullOrWhiteSpace(
                            dto.Description)
                            ? null
                            : dto.Description.Trim(),

                    ContributorTypeId =
                        dto.ContributorTypeId,

                    IsActive = true,

                    CreatedAt =
                        DateTime.UtcNow
                };

            // --------------------------------------------------------
            // SAVE
            // --------------------------------------------------------

            var created =
                await _subTypeRepository
                    .AddAsync(subType);

            // --------------------------------------------------------
            // Reload entity so ContributorType navigation
            // can be included in the DTO.
            // --------------------------------------------------------

            var result =
                await _subTypeRepository
                    .GetByIdAsync(
                        created.Id);

            if (result == null)
            {
                return null;
            }

            return MapToDto(result);
        }

        // ============================================================
        // UPDATE
        // ============================================================

        public async Task<bool>
            UpdateAsync(
                Guid id,
                UpdateContributorSubTypeDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(
                    nameof(dto));
            }

            var subType =
                await _subTypeRepository
                    .GetByIdAsync(id);

            if (subType == null)
            {
                return false;
            }

            // --------------------------------------------------------
            // Validate name
            // --------------------------------------------------------

            var name =
                dto.Name?.Trim();

            if (string.IsNullOrWhiteSpace(name))
            {
                throw new InvalidOperationException(
                    "Contributor subtype name is required.");
            }

            // --------------------------------------------------------
            // Prevent duplicate names
            // --------------------------------------------------------

            var existing =
                await _subTypeRepository
                    .GetByNameAsync(
                        subType.ContributorTypeId,
                        name);

            if (
                existing != null &&
                existing.Id != id
            )
            {
                throw new InvalidOperationException(
                    "A contributor subtype with this name already exists under this contributor type.");
            }

            // --------------------------------------------------------
            // Update
            // --------------------------------------------------------

            subType.Name =
                name;

            subType.Description =
                string.IsNullOrWhiteSpace(
                    dto.Description)
                    ? null
                    : dto.Description.Trim();

            subType.IsActive =
                dto.IsActive;

            subType.UpdatedAt =
                DateTime.UtcNow;

            await _subTypeRepository
                .UpdateAsync(subType);

            return true;
        }

        // ============================================================
        // DELETE
        // ============================================================

        public async Task<bool>
            DeleteAsync(Guid id)
        {
            var subType =
                await _subTypeRepository
                    .GetByIdAsync(id);

            if (subType == null)
            {
                return false;
            }

            // --------------------------------------------------------
            // Prevent deleting subtype assigned to team members
            // --------------------------------------------------------

            if (
                subType.TeamMembers != null &&
                subType.TeamMembers.Any()
            )
            {
                throw new InvalidOperationException(
                    "This contributor subtype cannot be deleted because it is currently assigned to team members.");
            }

            await _subTypeRepository
                .DeleteAsync(subType);

            return true;
        }

        // ============================================================
        // ENTITY -> DTO
        // ============================================================

        private static ContributorSubTypeDto
            MapToDto(
                ContributorSubType subType)
        {
            return new ContributorSubTypeDto
            {
                Id =
                    subType.Id,

                ContributorTypeId =
                    subType.ContributorTypeId,

                ContributorTypeName =
                    subType.ContributorType?.Name
                    ?? string.Empty,

                Name =
                    subType.Name,

                Description =
                    subType.Description,

                IsActive =
                    subType.IsActive,

                CreatedAt =
                    subType.CreatedAt,

                UpdatedAt =
                    subType.UpdatedAt
            };
        }
    }
}

