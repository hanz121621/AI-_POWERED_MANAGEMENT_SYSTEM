using AI_PMS.Application.DTOs.Permissions;
using AI_PMS.Application.Interfaces.Permissions;

using AI_PMS.Domain.Entities.Permissions;

using AI_PMS.Application.Interfaces.Repositories.Permissions;


namespace AI_PMS.Application.Services.Permissions
{
    public class PermissionService : IPermissionService
    {
        private readonly IPermissionRepository _permissionRepository;

        public PermissionService(
    IPermissionRepository permissionRepository)
        {
            _permissionRepository =
                permissionRepository;
        }

        // =========================================================
        // CREATE PERMISSION
        // =========================================================

        public async Task<PermissionDto>
            CreatePermissionAsync(
                CreatePermissionDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            // -----------------------------------------------------
            // VALIDATE NAME
            // -----------------------------------------------------

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new InvalidOperationException(
                    "Permission name is required.");
            }

            var normalizedName =
                dto.Name.Trim();

            // -----------------------------------------------------
            // CHECK DUPLICATE
            // -----------------------------------------------------

            var existing =
                await _permissionRepository
                    .GetByNameAsync(normalizedName);

            if (existing != null)
            {
                throw new InvalidOperationException(
                    "A permission with this name already exists.");
            }

            // -----------------------------------------------------
            // CREATE ENTITY
            // -----------------------------------------------------

            var permission = new Permission
            {
                Id =
                    Guid.NewGuid(),

                Name =
                    normalizedName,

                Description =
                    string.IsNullOrWhiteSpace(dto.Description)
                        ? null
                        : dto.Description.Trim(),

                IsActive =
                    true,

                CreatedAt =
                    DateTime.UtcNow
            };

            // -----------------------------------------------------
            // SAVE
            // -----------------------------------------------------

            var createdPermission =
                await _permissionRepository
                    .AddAsync(permission);

            return MapToDto(createdPermission);
        }

        // =========================================================
        // GET ALL PERMISSIONS
        // =========================================================

        public async Task<IEnumerable<PermissionDto>>
            GetAllPermissionsAsync()
        {
            var permissions =
                await _permissionRepository
                    .GetAllAsync();

            return permissions.Select(MapToDto);
        }

        // =========================================================
        // GET ACTIVE PERMISSIONS
        // =========================================================

        public async Task<IEnumerable<PermissionDto>>
            GetActivePermissionsAsync()
        {
            var permissions =
                await _permissionRepository
                    .GetActiveAsync();

            return permissions.Select(MapToDto);
        }

        // =========================================================
        // GET PERMISSION BY ID
        // =========================================================

        public async Task<PermissionDto?>
            GetPermissionByIdAsync(
                Guid id)
        {
            var permission =
                await _permissionRepository
                    .GetByIdAsync(id);

            if (permission == null)
            {
                return null;
            }

            return MapToDto(permission);
        }

        // =========================================================
        // UPDATE PERMISSION
        // =========================================================

        public async Task<bool>
            UpdatePermissionAsync(
                Guid id,
                UpdatePermissionDto dto)
        {
            if (dto == null)
            {
                throw new ArgumentNullException(nameof(dto));
            }

            // -----------------------------------------------------
            // FIND PERMISSION
            // -----------------------------------------------------

            var permission =
                await _permissionRepository
                    .GetByIdAsync(id);

            if (permission == null)
            {
                return false;
            }

            // -----------------------------------------------------
            // VALIDATE NAME
            // -----------------------------------------------------

            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                throw new InvalidOperationException(
                    "Permission name is required.");
            }

            var normalizedName =
                dto.Name.Trim();

            // -----------------------------------------------------
            // CHECK DUPLICATE NAME
            // -----------------------------------------------------

            var existing =
                await _permissionRepository
                    .GetByNameAsync(normalizedName);

            if (
                existing != null &&
                existing.Id != id)
            {
                throw new InvalidOperationException(
                    "A permission with this name already exists.");
            }

            // -----------------------------------------------------
            // NORMALIZE DESCRIPTION
            // -----------------------------------------------------

            var normalizedDescription =
                string.IsNullOrWhiteSpace(dto.Description)
                    ? null
                    : dto.Description.Trim();

            // -----------------------------------------------------
            // NO CHANGE CHECK
            // -----------------------------------------------------

            var noChanges =
                string.Equals(
                    permission.Name,
                    normalizedName,
                    StringComparison.OrdinalIgnoreCase)

                &&

                string.Equals(
                    permission.Description,
                    normalizedDescription,
                    StringComparison.OrdinalIgnoreCase)

                &&

                permission.IsActive ==
                    dto.IsActive;

            if (noChanges)
            {
                throw new InvalidOperationException(
                    "No changes were made. The submitted permission information is already the same.");
            }

            // -----------------------------------------------------
            // APPLY CHANGES
            // -----------------------------------------------------

            permission.Name =
                normalizedName;

            permission.Description =
                normalizedDescription;

            permission.IsActive =
                dto.IsActive;

            permission.UpdatedAt =
                DateTime.UtcNow;

            // -----------------------------------------------------
            // SAVE
            // -----------------------------------------------------

            await _permissionRepository
                .UpdateAsync(permission);

            return true;
        }

        // =========================================================
        // DELETE PERMISSION
        // =========================================================

        public async Task<bool>
            DeletePermissionAsync(
                Guid id)
        {
            var permission =
                await _permissionRepository
                    .GetByIdAsync(id);

            if (permission == null)
            {
                return false;
            }

            // -----------------------------------------------------
            // SAFETY CHECK
            // -----------------------------------------------------
            // A permission may already be referenced by
            // RolePermission or UserPermission.
            //
            // We deactivate instead of risking a foreign-key
            // deletion failure.
            // -----------------------------------------------------

            permission.IsActive =
                false;

            permission.UpdatedAt =
                DateTime.UtcNow;

            await _permissionRepository
                .UpdateAsync(permission);

            return true;
        }

        // =========================================================
        // CHANGE PERMISSION STATUS
        // =========================================================

        public async Task<bool>
            ChangePermissionStatusAsync(
                Guid id,
                bool isActive)
        {
            var permission =
                await _permissionRepository
                    .GetByIdAsync(id);

            if (permission == null)
            {
                return false;
            }

            if (permission.IsActive == isActive)
            {
                throw new InvalidOperationException(
                    isActive
                        ? "Permission is already active."
                        : "Permission is already inactive.");
            }

            permission.IsActive =
                isActive;

            permission.UpdatedAt =
                DateTime.UtcNow;

            await _permissionRepository
                .UpdateAsync(permission);

            return true;
        }

        // =========================================================
        // ENTITY → DTO
        // =========================================================

        private static PermissionDto MapToDto(
            Permission permission)
        {
            return new PermissionDto
            {
                Id =
                    permission.Id,

                Name =
                    permission.Name,

                Description =
                    permission.Description,

                IsActive =
                    permission.IsActive,

                CreatedAt =
                    permission.CreatedAt,

                UpdatedAt =
                    permission.UpdatedAt
            };
        }
    }
}