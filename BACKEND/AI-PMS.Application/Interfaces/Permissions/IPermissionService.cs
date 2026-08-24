using AI_PMS.Application.DTOs.Permissions;

namespace AI_PMS.Application.Interfaces.Permissions
{
    public interface IPermissionService
    {
        // =========================================================
        // CREATE PERMISSION
        // =========================================================

        Task<PermissionDto> CreatePermissionAsync(
            CreatePermissionDto dto);

        // =========================================================
        // GET PERMISSIONS
        // =========================================================

        Task<IEnumerable<PermissionDto>> GetAllPermissionsAsync();

        Task<IEnumerable<PermissionDto>> GetActivePermissionsAsync();

        Task<PermissionDto?> GetPermissionByIdAsync(
            Guid id);

        // =========================================================
        // UPDATE PERMISSION
        // =========================================================

        Task<bool> UpdatePermissionAsync(
            Guid id,
            UpdatePermissionDto dto);

        // =========================================================
        // DELETE PERMISSION
        // =========================================================

        Task<bool> DeletePermissionAsync(
            Guid id);

        // =========================================================
        // CHANGE STATUS
        // =========================================================

        Task<bool> ChangePermissionStatusAsync(
            Guid id,
            bool isActive);
    }
}