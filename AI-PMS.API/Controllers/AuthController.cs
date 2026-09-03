using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    // ========================================================
    // REGISTER
    // ========================================================

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var user = await _userService.RegisterAsync(
                request,
                cancellationToken);

            return Ok(user);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // ========================================================
    // LOGIN
    // ========================================================

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken)
    {
        var result = await _userService.LoginAsync(
            request,
            cancellationToken);

        if (result == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        return Ok(result);
    }

    // ========================================================
    // CURRENT USER
    // ========================================================

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        return Ok(new
        {
            id = User.FindFirst(
                ClaimTypes.NameIdentifier)?.Value,

            email = User.FindFirst(
                ClaimTypes.Email)?.Value,

            name = User.FindFirst(
                ClaimTypes.Name)?.Value,

            role = User.FindFirst(
                ClaimTypes.Role)?.Value
        });
    }

    // ========================================================
    // DEVELOPER TEST
    // ========================================================

    [HttpGet("developer-test")]
    [Authorize(Roles = "Developer")]
    public IActionResult DeveloperTest()
    {
        return Ok(new
        {
            message = "Developer authorization successful.",
            role = "Developer"
        });
    }

    // ========================================================
    // STAFF TEST
    // ========================================================

    [HttpGet("staff-test")]
    [Authorize(Roles = "Staff")]
    public IActionResult StaffTest()
    {
        return Ok(new
        {
            message = "Staff authorization successful.",
            role = "Staff"
        });
    }

    // ========================================================
    // TEAM LEADER TEST
    // ========================================================

    [HttpGet("teamleader-test")]
    [Authorize(Roles = "TeamLeader")]
    public IActionResult TeamLeaderTest()
    {
        return Ok(new
        {
            message = "Team Leader authorization successful.",
            role = "TeamLeader"
        });
    }
}