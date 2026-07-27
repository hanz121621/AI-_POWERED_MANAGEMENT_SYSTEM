using AI_PMS.Application.DTOs.Users;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDto dto)
        {
            var user = await _userService.CreateUserAsync(dto);

            return Ok(user);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, UpdateUserDto dto)
        {
            var user = await _userService.UpdateUserAsync(id, dto);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var deleted = await _userService.DeleteUserAsync(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("{id}/profile")]
        public async Task<IActionResult> GetUserProfile(Guid id)
        {
            var profile = await _userService.GetUserProfileAsync(id);

            if (profile == null)
            {
                return NotFound();
            }

            return Ok(profile);
        }

        [HttpPut("assign-role")]
        public async Task<IActionResult> AssignRole(AssignRoleDto dto)
        {
            var result = await _userService.AssignRoleAsync(dto);

            if (!result)
            {
                return NotFound();
            }

            return Ok("Role assigned successfully.");
        }

        [HttpPut("activate")]
        public async Task<IActionResult> ActivateUser(ActivateUserDto dto)
        {
            var result = await _userService.ActivateUserAsync(dto);

            if (!result)
            {
                return NotFound();
            }

            return Ok("User activated successfully.");
        }

        [HttpPut("deactivate")]
        public async Task<IActionResult> DeactivateUser(DeactivateUserDto dto)
        {
            var result = await _userService.DeactivateUserAsync(dto);

            if (!result)
            {
                return NotFound();
            }

            return Ok("User deactivated successfully.");
        }
    }
}