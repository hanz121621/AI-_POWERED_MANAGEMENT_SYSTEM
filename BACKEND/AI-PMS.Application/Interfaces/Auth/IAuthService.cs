using AI_PMS.Application.DTOs.Auth;

namespace AI_PMS.Application.Interfaces.Auth;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request);

    Task<bool> LogoutAsync(string refreshToken);

    Task<ChangePasswordResponseDto> ChangePasswordAsync(
        Guid userId,
        ChangePasswordRequestDto request);

    Task<ForgotPasswordResponseDto> ForgotPasswordAsync(
        ForgotPasswordRequestDto request);

    Task<ResetPasswordResponseDto> ResetPasswordAsync(
        ResetPasswordRequestDto request);

    Task<RefreshTokenResponseDto> RefreshTokenAsync(
        RefreshTokenRequestDto request);
}