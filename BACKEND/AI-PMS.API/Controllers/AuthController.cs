using AI_PMS.Application.DTOs.Auth;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Register a new user
    /// </summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(RegisterRequestDto request)
    {
        var result = await _authService.RegisterAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// Login user
    /// </summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        var result = await _authService.LoginAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// Refresh JWT Token
    /// </summary>
    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<IActionResult> RefreshToken(RefreshTokenRequestDto request)
    {
        var result = await _authService.RefreshTokenAsync(request);
        return Ok(result);
    }

    /// <summary>
    /// Logout current user
    /// </summary>
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _authService.LogoutAsync(User.Identity?.Name!);
        return Ok(new
        {
            Message = "Logged out successfully."
        });
    }

    /// <summary>
    /// Change Password
    /// </summary>
    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto request)
    {
        await _authService.ChangePasswordAsync(User.Identity?.Name!, request);
        return Ok(new
        {
            Message = "Password changed successfully."
        });
    }

    /// <summary>
    /// Forgot Password
    /// </summary>
    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordDto request)
    {
        await _authService.ForgotPasswordAsync(request);
        return Ok(new
        {
            Message = "Password reset instructions sent."
        });
    }

    /// <summary>
    /// Reset Password
    /// </summary>
    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto request)
    {
        await _authService.ResetPasswordAsync(request);
        return Ok(new
        {
            Message = "Password reset successfully."
        });
    }

    /// <summary>
    /// Get Current Logged-in User
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var result = await _authService.GetCurrentUserAsync(User.Identity?.Name!);
        return Ok(result);
    }
}