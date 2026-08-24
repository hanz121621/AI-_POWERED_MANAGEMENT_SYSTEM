using AI_PMS.API.Authorization;
using AI_PMS.Application.DTOs.Permissions;
using AI_PMS.Infrastructure.Repositories.Permissions;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Permissions
{
    [ApiController]
    [Route("api/permissions")]
    [Authorize]
    public class PermissionController : ControllerBase
    {
        private readonly PermissionRepository _permissionRepository;

        public PermissionController(
            PermissionRepository permissionRepository)
        {
            _permissionRepository = permissionRepository;
        }

        // =========================================================
        // GET ALL PERMISSIONS
        // GET: api/permissions
        // =========================================================

        [HttpGet]
        [RequirePermission("Permissions.View")]
        public async Task<IActionResult> GetAllPermissions()
        {
            var permissions =
                await _permissionRepository.GetAllAsync();

            var result = permissions.Select(p => new PermissionDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            });

            return Ok(result);
        }

        // =========================================================
        // GET ACTIVE PERMISSIONS
        // GET: api/permissions/active
        // =========================================================

        [HttpGet("active")]
        [RequirePermission("Permissions.View")]
        public async Task<IActionResult> GetActivePermissions()
        {
            var permissions =
                await _permissionRepository.GetActiveAsync();

            var result = permissions.Select(p => new PermissionDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            });

            return Ok(result);
        }

        // =========================================================
        // GET PERMISSION BY ID
        // GET: api/permissions/{id}
        // =========================================================

        [HttpGet("{id:guid}")]
        [RequirePermission("Permissions.View")]
        public async Task<IActionResult> GetPermission(Guid id)
        {
            var permission =
                await _permissionRepository.GetByIdAsync(id);

            if (permission == null)
            {
                return NotFound(new
                {
                    message = "Permission not found."
                });
            }

            return Ok(new PermissionDto
            {
                Id = permission.Id,
                Name = permission.Name,
                Description = permission.Description,
                IsActive = permission.IsActive,
                CreatedAt = permission.CreatedAt,
                UpdatedAt = permission.UpdatedAt
            });
        }

        // =========================================================
        // CREATE
        // POST: api/permissions
        // =========================================================

        [HttpPost]
        [RequirePermission("Permissions.Create")]
        public async Task<IActionResult> CreatePermission(
            [FromBody] CreatePermissionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid permission information.",
                    errors = ModelState
                });
            }

            var normalizedName =
                dto.Name.Trim();

            var existing =
                await _permissionRepository
                    .GetByNameAsync(normalizedName);

            if (existing != null)
            {
                return Conflict(new
                {
                    message =
                        "A permission with this name already exists."
                });
            }

            var permission = new AI_PMS.Domain.Entities.Permissions.Permission
            {
                Id = Guid.NewGuid(),

                Name = normalizedName,

                Description =
                    string.IsNullOrWhiteSpace(dto.Description)
                        ? null
                        : dto.Description.Trim(),

                IsActive = true,

                CreatedAt = DateTime.UtcNow
            };

            await _permissionRepository
                .AddAsync(permission);

            return CreatedAtAction(
                nameof(GetPermission),
                new
                {
                    id = permission.Id
                },
                new PermissionDto
                {
                    Id = permission.Id,
                    Name = permission.Name,
                    Description = permission.Description,
                    IsActive = permission.IsActive,
                    CreatedAt = permission.CreatedAt,
                    UpdatedAt = permission.UpdatedAt
                });
        }

        // =========================================================
        // UPDATE
        // PUT: api/permissions/{id}
        // =========================================================

        [HttpPut("{id:guid}")]
        [RequirePermission("Permissions.Update")]
        public async Task<IActionResult> UpdatePermission(
            Guid id,
            [FromBody] UpdatePermissionDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid permission information.",
                    errors = ModelState
                });
            }

            var permission =
                await _permissionRepository
                    .GetByIdAsync(id);

            if (permission == null)
            {
                return NotFound(new
                {
                    message = "Permission not found."
                });
            }

            var existing =
                await _permissionRepository
                    .GetByNameAsync(dto.Name);

            if (existing != null &&
                existing.Id != id)
            {
                return Conflict(new
                {
                    message =
                        "A permission with this name already exists."
                });
            }

            permission.Name =
                dto.Name.Trim();

            permission.Description =
                string.IsNullOrWhiteSpace(dto.Description)
                    ? null
                    : dto.Description.Trim();

            permission.IsActive =
                dto.IsActive;

            permission.UpdatedAt =
                DateTime.UtcNow;

            await _permissionRepository
                .UpdateAsync(permission);

            return Ok(new
            {
                message =
                    "Permission updated successfully."
            });
        }

        // =========================================================
        // DELETE
        // DELETE: api/permissions/{id}
        // =========================================================

        [HttpDelete("{id:guid}")]
        [RequirePermission("Permissions.Delete")]
        public async Task<IActionResult> DeletePermission(
            Guid id)
        {
            var permission =
                await _permissionRepository
                    .GetByIdAsync(id);

            if (permission == null)
            {
                return NotFound(new
                {
                    message = "Permission not found."
                });
            }

            await _permissionRepository
                .DeleteAsync(permission);

            return Ok(new
            {
                message =
                    "Permission deleted successfully."
            });
        }
    }
}