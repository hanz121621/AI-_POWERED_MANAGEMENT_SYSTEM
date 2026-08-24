using AI_PMS.Application.Interfaces.Permissions;
using AI_PMS.Application.Interfaces.Users;
using AI_PMS.Application.Interfaces.Auth;
using Microsoft.AspNetCore.Authorization;

namespace AI_PMS.API.Authorization
{
    public class PermissionAuthorizationHandler
        : AuthorizationHandler<PermissionRequirement>
    {
        private readonly IRolePermissionService _rolePermissionService;
       private readonly AI_PMS.Application.Interfaces.Permissions.IUserPermissionService
    _userPermissionService;
        private readonly ICurrentUserService _currentUserService;

        public PermissionAuthorizationHandler(
            IRolePermissionService rolePermissionService,
           AI_PMS.Application.Interfaces.Permissions.IUserPermissionService
    userPermissionService,
            ICurrentUserService currentUserService)
        {
            _rolePermissionService = rolePermissionService;
            _userPermissionService = userPermissionService;
            _currentUserService = currentUserService;
        }

        protected override async Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            var userId = _currentUserService.UserId;

            if (userId == Guid.Empty)
            {
                return;
            }

            // -----------------------------------------------------
            // GET USER ROLE
            // -----------------------------------------------------

            var roleClaim = context.User.FindFirst(
                System.Security.Claims.ClaimTypes.Role);

            if (roleClaim == null)
            {
                return;
            }

            if (!Enum.TryParse<AI_PMS.Domain.Enums.Role>(
                    roleClaim.Value,
                    true,
                    out var role))
            {
                return;
            }

            // -----------------------------------------------------
            // CHECK USER-SPECIFIC PERMISSION OVERRIDE
            // -----------------------------------------------------

            var userPermissions =
                await _userPermissionService
                    .GetPermissionsByUserIdAsync(userId);

            var userPermission =
                userPermissions.FirstOrDefault(p =>
                    string.Equals(
                        p.PermissionName,
                        requirement.Permission,
                        StringComparison.OrdinalIgnoreCase));

            if (userPermission != null)
            {
                if (userPermission.IsEnabled)
                {
                    context.Succeed(requirement);
                }

                return;
            }

            // -----------------------------------------------------
            // CHECK ROLE PERMISSION
            // -----------------------------------------------------

            var rolePermissions =
                await _rolePermissionService
                    .GetPermissionsByRoleAsync(role);

            var rolePermission =
                rolePermissions.FirstOrDefault(p =>
                    string.Equals(
                        p.PermissionName,
                        requirement.Permission,
                        StringComparison.OrdinalIgnoreCase));

            if (rolePermission != null &&
                rolePermission.IsEnabled)
            {
                context.Succeed(requirement);
            }
        }
    }
}