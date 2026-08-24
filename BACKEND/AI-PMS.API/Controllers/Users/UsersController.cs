using AI_PMS.API.Authorization;
using AI_PMS.Application.DTOs.Users;
using AI_PMS.Application.Interfaces.Auth;
using AI_PMS.Application.Interfaces.Users;
using AI_PMS.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Users
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ICurrentUserService _currentUserService;

        public UsersController(
            IUserService userService,
            ICurrentUserService currentUserService)
        {
            _userService = userService;
            _currentUserService = currentUserService;
        }

        // =========================================================
        // GET ALL USERS
        // GET: api/users
        // =========================================================

        [HttpGet]
        [RequirePermission("Users.View")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users =
                await _userService.GetAllUsersAsync();

            return Ok(users);
        }

        // =========================================================
        // GET USER BY ID
        // GET: api/users/{id}
        // =========================================================

        [HttpGet("{id:guid}")]
        [RequirePermission("Users.View")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user =
                await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            return Ok(user);
        }

        // =========================================================
        // CREATE USER
        // POST: api/users
        // =========================================================

        [HttpPost]
        [RequirePermission("Users.Create")]
        public async Task<IActionResult> CreateUser(
            [FromBody] CreateUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid user information.",
                    errors = GetModelStateErrors()
                });
            }

            try
            {
                var user =
                    await _userService.CreateUserAsync(dto);

                if (user == null)
                {
                    return Conflict(new
                    {
                        message =
                            "A user with this email already exists."
                    });
                }

                return CreatedAtAction(
                    nameof(GetUserById),
                    new
                    {
                        id = user.Id
                    },
                    new
                    {
                        message =
                            "User created successfully.",

                        id =
                            user.Id,

                        fullName =
                            user.FullName,

                        email =
                            user.Email,

                        role =
                            user.Role.ToString(),

                        isActive =
                            user.IsActive,

                        contributorTypeId =
                            user.ContributorTypeId,

                        contributorTypeName =
                            user.ContributorTypeName,

                        contributorSubTypeId =
                            user.ContributorSubTypeId,

                        contributorSubTypeName =
                            user.ContributorSubTypeName,

                        phoneNumber =
                            user.PhoneNumber,

                        bio =
                            user.Bio,

                        createdAt =
                            user.CreatedAt,

                        updatedAt =
                            user.UpdatedAt
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
        // UPDATE USER
        // PUT: api/users/{id}
        // =========================================================

        [HttpPut("{id:guid}")]
        [RequirePermission("Users.Update")]
        public async Task<IActionResult> UpdateUser(
            Guid id,
            [FromBody] UpdateUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Invalid user information.",
                    errors = GetModelStateErrors()
                });
            }

            try
            {
                var result =
                    await _userService.UpdateUserAsync(
                        id,
                        dto);

                if (!result)
                {
                    return NotFound(new
                    {
                        message = "User not found."
                    });
                }

                return Ok(new
                {
                    message =
                        "User updated successfully."
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
        // DELETE USER
        // DELETE: api/users/{id}
        // =========================================================

        [HttpDelete("{id:guid}")]
        [RequirePermission("Users.Delete")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var result =
                await _userService.DeleteUserAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            return Ok(new
            {
                message =
                    "User deleted successfully."
            });
        }

        // =========================================================
        // CHANGE USER STATUS
        // PATCH: api/users/{id}/status
        // =========================================================

        [HttpPatch("{id:guid}/status")]
        [RequirePermission("Users.ChangeStatus")]
        public async Task<IActionResult> ChangeUserStatus(
            Guid id,
            [FromQuery] bool isActive)
        {
            try
            {
                var result =
                    await _userService.ChangeUserStatusAsync(
                        id,
                        isActive);

                if (!result)
                {
                    return NotFound(new
                    {
                        message = "User not found."
                    });
                }

                return Ok(new
                {
                    message = isActive
                        ? "User activated successfully."
                        : "User deactivated successfully."
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
        // CHANGE USER ROLE
        // PATCH: api/users/{id}/role
        // =========================================================

        [HttpPatch("{id:guid}/role")]
        [RequirePermission("Users.ChangeRole")]
        public async Task<IActionResult> ChangeUserRole(
            Guid id,
            [FromQuery] Role role)
        {
            try
            {
                var result =
                    await _userService.ChangeUserRoleAsync(
                        id,
                        role);

                if (!result)
                {
                    return NotFound(new
                    {
                        message = "User not found."
                    });
                }

                return Ok(new
                {
                    message =
                        "User role changed successfully."
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
        // GET MY PROFILE
        // GET: api/users/profile
        // =========================================================

        [HttpGet("profile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId =
                _currentUserService.UserId;

            if (userId == Guid.Empty)
            {
                return Unauthorized(new
                {
                    message =
                        "Invalid user identity."
                });
            }

            var user =
                await _userService.GetMyProfileAsync(
                    userId);

            if (user == null)
            {
                return NotFound(new
                {
                    message =
                        "Profile not found."
                });
            }

            return Ok(user);
        }

        // =========================================================
        // UPDATE MY PROFILE
        // PUT: api/users/profile
        // =========================================================

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateMyProfile(
            [FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message =
                        "Invalid profile information.",

                    errors =
                        GetModelStateErrors()
                });
            }

            var userId =
                _currentUserService.UserId;

            if (userId == Guid.Empty)
            {
                return Unauthorized(new
                {
                    message =
                        "Invalid user identity."
                });
            }

            try
            {
                var result =
                    await _userService.UpdateMyProfileAsync(
                        userId,
                        dto);

                if (!result)
                {
                    return NotFound(new
                    {
                        message =
                            "Profile not found."
                    });
                }

                return Ok(new
                {
                    message =
                        "Profile updated successfully."
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
        // MODEL STATE ERRORS
        // =========================================================

        private Dictionary<string, string[]> GetModelStateErrors()
        {
            return ModelState
                .Where(x => x.Value != null)
                .ToDictionary(
                    x => x.Key,
                    x => x.Value!.Errors
                        .Select(e =>
                            string.IsNullOrWhiteSpace(
                                e.ErrorMessage)
                                ? "Invalid value."
                                : e.ErrorMessage)
                        .ToArray());
        }
    }
}