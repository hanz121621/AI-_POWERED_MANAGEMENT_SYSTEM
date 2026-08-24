using AI_PMS.API.Authorization;
using AI_PMS.Application.Interfaces.Permissions;
using AI_PMS.Domain.Enums;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Permissions
{
    [ApiController]
    [Route("api/role-permissions")]
    [Authorize]
    public class RolePermissionsController : ControllerBase
    {
        private readonly IRolePermissionService
            _rolePermissionService;

        public RolePermissionsController(
            IRolePermissionService rolePermissionService)
        {
            _rolePermissionService =
                rolePermissionService;
        }

        // =========================================================
        // GET PERMISSIONS BY ROLE
        // GET: api/role-permissions/{role}
        // =========================================================

        [HttpGet("{role}")]
        [RequirePermission("RolePermissions.View")]
        public async Task<IActionResult> GetPermissionsByRole(
            Role role)
        {
            if (!Enum.IsDefined(typeof(Role), role))
            {
                return BadRequest(new
                {
                    message = "Invalid role."
                });
            }

            var permissions =
                await _rolePermissionService
                    .GetPermissionsByRoleAsync(role);

            return Ok(permissions);
        }

        // =========================================================
        // GET SPECIFIC ROLE PERMISSION
        // =========================================================

        [HttpGet("{role}/{permissionId:guid}")]
        [RequirePermission("RolePermissions.View")]
        public async Task<IActionResult> GetRolePermission(
            Role role,
            Guid permissionId)
        {
            if (!Enum.IsDefined(typeof(Role), role))
            {
                return BadRequest(new
                {
                    message = "Invalid role."
                });
            }

            var permission =
                await _rolePermissionService
                    .GetRolePermissionAsync(
                        role,
                        permissionId);

            if (permission == null)
            {
                return NotFound(new
                {
                    message =
                        "Role permission not found."
                });
            }

            return Ok(permission);
        }

        // =========================================================
        // ENABLE / DISABLE
        // PUT: api/role-permissions/{role}/{permissionId}
        // =========================================================

        [HttpPut("{role}/{permissionId:guid}")]
        [RequirePermission("RolePermissions.Assign")]
        public async Task<IActionResult> SetRolePermission(
            Role role,
            Guid permissionId,
            [FromQuery] bool isEnabled)
        {
            if (!Enum.IsDefined(typeof(Role), role))
            {
                return BadRequest(new
                {
                    message = "Invalid role."
                });
            }

            try
            {
                await _rolePermissionService
                    .SetRolePermissionAsync(
                        role,
                        permissionId,
                        isEnabled);

                return Ok(new
                {
                    message = isEnabled
                        ? "Role permission enabled successfully."
                        : "Role permission disabled successfully."
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
        // DELETE
        // DELETE: api/role-permissions/{role}/{permissionId}
        // =========================================================

        [HttpDelete("{role}/{permissionId:guid}")]
        [RequirePermission("RolePermissions.Delete")]
        public async Task<IActionResult> DeleteRolePermission(
            Role role,
            Guid permissionId)
        {
            if (!Enum.IsDefined(typeof(Role), role))
            {
                return BadRequest(new
                {
                    message = "Invalid role."
                });
            }

            var result =
                await _rolePermissionService
                    .DeleteRolePermissionAsync(
                        role,
                        permissionId);

            if (!result)
            {
                return NotFound(new
                {
                    message =
                        "Role permission not found."
                });
            }

            return Ok(new
            {
                message =
                    "Role permission deleted successfully."
            });
        }
    }
}