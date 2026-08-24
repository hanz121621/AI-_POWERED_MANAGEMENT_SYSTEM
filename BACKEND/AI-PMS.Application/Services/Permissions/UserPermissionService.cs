using AI_PMS.Application.DTOs.Permissions;
using AI_PMS.Application.Interfaces.Permissions;

using AI_PMS.Domain.Entities.Permissions;
using AI_PMS.Application.Interfaces.Repositories.Permissions;
using AI_PMS.Application.Interfaces.Repositories.Users;

namespace AI_PMS.Application.Services.Permissions
{
    public class UserPermissionService : IUserPermissionService
    {
        private readonly IUserPermissionRepository _userPermissionRepository;
        private readonly IPermissionRepository _permissionRepository;
        private readonly IUserRepository _userRepository;

        public UserPermissionService(
            IUserPermissionRepository userPermissionRepository,
            IPermissionRepository permissionRepository,
            IUserRepository userRepository)
        {
            _userPermissionRepository =
                userPermissionRepository;

            _permissionRepository =
                permissionRepository;

            _userRepository =
                userRepository;
        }

        // =========================================================
        // GET ALL PERMISSIONS FOR USER
        // =========================================================

        public async Task<IEnumerable<UserPermissionDto>>
            GetPermissionsByUserIdAsync(
                Guid userId)
        {
            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                throw new InvalidOperationException(
                    "User not found.");
            }

            var permissions =
                await _userPermissionRepository
                    .GetByUserIdAsync(userId);

            return permissions.Select(MapToDto);
        }

        // =========================================================
        // GET SPECIFIC USER PERMISSION
        // =========================================================

        public async Task<UserPermissionDto?>
            GetUserPermissionAsync(
                Guid userId,
                Guid permissionId)
        {
            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                throw new InvalidOperationException(
                    "User not found.");
            }

            var permission =
                await _userPermissionRepository
                    .GetAsync(
                        userId,
                        permissionId);

            if (permission == null)
            {
                return null;
            }

            return MapToDto(permission);
        }

        // =========================================================
        // SET USER PERMISSION
        // =========================================================

        public async Task<bool> SetUserPermissionAsync(
            Guid userId,
            Guid permissionId,
            bool isEnabled)
        {
            // -----------------------------------------------------
            // USER VALIDATION
            // -----------------------------------------------------

            var user =
                await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                throw new InvalidOperationException(
                    "User not found.");
            }

            // -----------------------------------------------------
            // PERMISSION VALIDATION
            // -----------------------------------------------------

            var permission =
                await _permissionRepository
                    .GetByIdAsync(permissionId);

            if (permission == null)
            {
                throw new InvalidOperationException(
                    "Permission not found.");
            }

            if (!permission.IsActive)
            {
                throw new InvalidOperationException(
                    "Cannot assign an inactive permission.");
            }

            // -----------------------------------------------------
            // CHECK EXISTING OVERRIDE
            // -----------------------------------------------------

            var existing =
                await _userPermissionRepository
                    .GetAsync(
                        userId,
                        permissionId);

            // =====================================================
            // CREATE USER OVERRIDE
            // =====================================================

            if (existing == null)
            {
                var userPermission =
                    new UserPermission
                    {
                        Id = Guid.NewGuid(),

                        UserId =
                            userId,

                        PermissionId =
                            permissionId,

                        IsEnabled =
                            isEnabled,

                        CreatedAt =
                            DateTime.UtcNow
                    };

                await _userPermissionRepository
                    .AddAsync(userPermission);

                return true;
            }

            // =====================================================
            // NO CHANGE
            // =====================================================

            if (existing.IsEnabled == isEnabled)
            {
                throw new InvalidOperationException(
                    isEnabled
                        ? "This user already has this permission enabled."
                        : "This user already has this permission disabled.");
            }

            // =====================================================
            // UPDATE
            // =====================================================

            existing.IsEnabled =
                isEnabled;

            existing.UpdatedAt =
                DateTime.UtcNow;

            await _userPermissionRepository
                .UpdateAsync(existing);

            return true;
        }

        // =========================================================
        // DELETE USER PERMISSION OVERRIDE
        // =========================================================

        public async Task<bool>
            DeleteUserPermissionAsync(
                Guid userId,
                Guid permissionId)
        {
            var existing =
                await _userPermissionRepository
                    .GetAsync(
                        userId,
                        permissionId);

            if (existing == null)
            {
                return false;
            }

            await _userPermissionRepository
                .DeleteAsync(existing);

            return true;
        }

        // =========================================================
        // ENTITY → DTO
        // =========================================================

        private static UserPermissionDto MapToDto(
            UserPermission userPermission)
        {
            return new UserPermissionDto
            {
                Id =
                    userPermission.Id,

                UserId =
                    userPermission.UserId,

                UserName =
                    userPermission.User?.FullName
                    ?? string.Empty,

                PermissionId =
                    userPermission.PermissionId,

                PermissionName =
                    userPermission.Permission?.Name
                    ?? string.Empty,

                IsEnabled =
                    userPermission.IsEnabled,

                CreatedAt =
                    userPermission.CreatedAt,

                UpdatedAt =
                    userPermission.UpdatedAt
            };
        }
    }
}