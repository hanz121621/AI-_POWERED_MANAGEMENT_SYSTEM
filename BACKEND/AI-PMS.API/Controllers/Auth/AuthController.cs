using AI_PMS.Application.DTOs.Auth;
using AI_PMS.Application.Interfaces.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Auth
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }


        
 [HttpPost("login")]
[AllowAnonymous]
public async Task<IActionResult> Login(LoginRequestDto request)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var result = await _authService.LoginAsync(request);

    if (!result.Success)
        return Unauthorized(result);

    return Ok(result);
}




    [HttpPost("logout")]
[Authorize]
public async Task<IActionResult> Logout([FromBody] RefreshTokenRequestDto request)
{
    var result = await _authService.LogoutAsync(request.RefreshToken);

    if (!result)
    {
        return BadRequest(new
        {
            Message = "Invalid or already revoked refresh token."
        });
    }

    return Ok(new
    {
        Message = "You have successfully logged out."
    });
}





[HttpPost("change-password")]
[Authorize]
public async Task<IActionResult> ChangePassword(ChangePasswordRequestDto request)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null)
    {
        return Unauthorized(new
        {
            Message = "Invalid user."
        });
    }

    var userId = Guid.Parse(userIdClaim.Value);

    var result = await _authService.ChangePasswordAsync(userId, request);

    if (!result.Success)
    {
        return BadRequest(result);
    }

    return Ok(result);
}






    [HttpPost("forgot-password")]
[AllowAnonymous]
public async Task<IActionResult> ForgotPassword(ForgotPasswordRequestDto request)
{
    var result = await _authService.ForgotPasswordAsync(request);

    if (!result.Success)
    {
        return BadRequest(result);
    }

    return Ok(result);
}






 [HttpPost("reset-password")]
[AllowAnonymous]
public async Task<IActionResult> ResetPassword(ResetPasswordRequestDto request)
{
    var result = await _authService.ResetPasswordAsync(request);

    if (!result.Success)
    {
        return BadRequest(result);
    }

    return Ok(result);
}







[HttpPost("refresh-token")]
[AllowAnonymous]
public async Task<IActionResult> RefreshToken(RefreshTokenRequestDto request)
{
    var result = await _authService.RefreshTokenAsync(request);

    if (!result.Success)
    {
        return Unauthorized(result);
    }

    return Ok(result);
}
    
    
    }
}