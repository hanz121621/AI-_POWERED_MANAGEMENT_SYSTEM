using AI_PMS.API.Authorization;
using AI_PMS.Application.Interfaces.Users;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Permissions
{
    [ApiController]
    [Route("api/user-permissions")]
    [Authorize]
    public class UserPermissionsController : ControllerBase
    {
        private readonly IUserPermissionService
            _userPermissionService;

        public UserPermissionsController(
            IUserPermissionService userPermissionService)
        {
            _userPermissionService =
                userPermissionService;
        }

        // =========================================================
        // GET USER PERMISSIONS
        // GET: api/user-permissions/user/{userId}
        // =========================================================

        [HttpGet("user/{userId:guid}")]
        [RequirePermission("UserPermissions.View")]
        public async Task<IActionResult> GetUserPermissions(
            Guid userId)
        {
            try
            {
                var permissions =
                    await _userPermissionService
                        .GetPermissionsByUserIdAsync(userId);

                return Ok(permissions);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
        }

        // =========================================================
        // GET SPECIFIC USER PERMISSION
        // =========================================================

        [HttpGet(
            "user/{userId:guid}/permission/{permissionId:guid}")]
        [RequirePermission("UserPermissions.View")]
        public async Task<IActionResult> GetUserPermission(
            Guid userId,
            Guid permissionId)
        {
            try
            {
                var permission =
                    await _userPermissionService
                        .GetUserPermissionAsync(
                            userId,
                            permissionId);

                if (permission == null)
                {
                    return NotFound(new
                    {
                        message =
                            "User permission not found."
                    });
                }

                return Ok(permission);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
        }

        // =========================================================
        // ENABLE / DISABLE USER PERMISSION
        // =========================================================

        [HttpPut(
            "user/{userId:guid}/permission/{permissionId:guid}")]
        [RequirePermission("UserPermissions.Assign")]
        public async Task<IActionResult> SetUserPermission(
            Guid userId,
            Guid permissionId,
            [FromQuery] bool isEnabled)
        {
            try
            {
                await _userPermissionService
                    .SetUserPermissionAsync(
                        userId,
                        permissionId,
                        isEnabled);

                return Ok(new
                {
                    message = isEnabled
                        ? "User permission enabled successfully."
                        : "User permission disabled successfully."
                });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new
                {
                    message = ex.Message
                });
            }
        }

        // =========================================================
        // DELETE USER PERMISSION OVERRIDE
        // =========================================================

        [HttpDelete(
            "user/{userId:guid}/permission/{permissionId:guid}")]
        [RequirePermission("UserPermissions.Delete")]
        public async Task<IActionResult> DeleteUserPermission(
            Guid userId,
            Guid permissionId)
        {
            var result =
                await _userPermissionService
                    .DeleteUserPermissionAsync(
                        userId,
                        permissionId);

            if (!result)
            {
                return NotFound(new
                {
                    message =
                        "User permission override not found."
                });
            }

            return Ok(new
            {
                message =
                    "User permission override deleted successfully."
            });
        }
    }
}