using AI_PMS.Application.DTOs.Auth;
using AI_PMS.Application.Interfaces.Auth;
using AI_PMS.Application.Interfaces.Repositories.Auth;
using AI_PMS.Application.Interfaces.Repositories.Users;
using AI_PMS.Application.Interfaces.Security;
using AI_PMS.Domain.Entities.Auth;




namespace AI_PMS.Application.Services.Auth;

public class AuthService : IAuthService
{private readonly IUserRepository _userRepository;
private readonly IRefreshTokenRepository _refreshTokenRepository;
private readonly IPasswordHasher _passwordHasher;
private readonly IJwtTokenService _jwtTokenService;
private readonly IRefreshTokenService _refreshTokenService;
   public AuthService(
    IUserRepository userRepository,
    IRefreshTokenRepository refreshTokenRepository,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService,
    IRefreshTokenService refreshTokenService)
{
    _userRepository = userRepository;
    _refreshTokenRepository = refreshTokenRepository;
    _passwordHasher = passwordHasher;
    _jwtTokenService = jwtTokenService;
    _refreshTokenService = refreshTokenService;
}

    // =========================================================
    // LOGIN
    // =========================================================

    public async Task<LoginResponseDto> LoginAsync(
        LoginRequestDto request)
    {
        var email = request.Email.Trim();

        var user = await _userRepository.GetByEmailAsync(email);

        if (user == null)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        if (!user.IsActive)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = "Your account has been deactivated."
            };
        }

        var isPasswordValid =
            _passwordHasher.VerifyPassword(
                request.Password,
                user.PasswordHash);

        if (!isPasswordValid)
        {
            return new LoginResponseDto
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        var accessToken =
            _jwtTokenService.GenerateToken(user);

        var refreshTokenValue =
            _refreshTokenService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = refreshTokenValue,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };

        await _refreshTokenRepository.AddAsync(refreshToken);

        return new LoginResponseDto
        {
            Success = true,
            Message = "Login successful.",
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        };
    }

    // =========================================================
    // LOGOUT
    // =========================================================

    public async Task<bool> LogoutAsync(string refreshToken)
    {
        var token =
            await _refreshTokenRepository.GetByTokenAsync(
                refreshToken);

        if (token == null)
            return false;

        if (token.IsRevoked)
            return false;

        token.IsRevoked = true;

        await _refreshTokenRepository.UpdateAsync(token);

        return true;
    }

    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    public async Task<ChangePasswordResponseDto>
        ChangePasswordAsync(
            Guid userId,
            ChangePasswordRequestDto request)
    {
        var user =
            await _userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            return new ChangePasswordResponseDto
            {
                Success = false,
                Message = "User not found."
            };
        }

        var currentPasswordValid =
            _passwordHasher.VerifyPassword(
                request.CurrentPassword,
                user.PasswordHash);

        if (!currentPasswordValid)
        {
            return new ChangePasswordResponseDto
            {
                Success = false,
                Message = "Current password is incorrect."
            };
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            return new ChangePasswordResponseDto
            {
                Success = false,
                Message = "Passwords do not match."
            };
        }

        var samePassword =
            _passwordHasher.VerifyPassword(
                request.NewPassword,
                user.PasswordHash);

        if (samePassword)
        {
            return new ChangePasswordResponseDto
            {
                Success = false,
                Message =
                    "The new password must be different from your current password."
            };
        }

        user.PasswordHash =
            _passwordHasher.HashPassword(
                request.NewPassword);

        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        return new ChangePasswordResponseDto
        {
            Success = true,
            Message = "Password changed successfully."
        };
    }

    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    public async Task<ForgotPasswordResponseDto>
        ForgotPasswordAsync(
            ForgotPasswordRequestDto request)
    {
        var email = request.Email.Trim();

        var user =
            await _userRepository.GetByEmailAsync(email);

        if (user == null)
        {
            return new ForgotPasswordResponseDto
            {
                Success = false,
                Message = "No account found with that email address."
            };
        }

        var resetToken =
            Guid.NewGuid().ToString();

        user.PasswordResetToken = resetToken;

        user.PasswordResetTokenExpiry =
            DateTime.UtcNow.AddHours(1);

        await _userRepository.UpdateAsync(user);

        // Email sending will be added later.

        return new ForgotPasswordResponseDto
        {
            Success = true,
            Message =
                "Password reset instructions have been generated."
        };
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    public async Task<ResetPasswordResponseDto>
        ResetPasswordAsync(
            ResetPasswordRequestDto request)
    {
        var user =
            await _userRepository
                .GetByPasswordResetTokenAsync(
                    request.Token);

        if (user == null)
        {
            return new ResetPasswordResponseDto
            {
                Success = false,
                Message = "Invalid password reset token."
            };
        }

        if (user.PasswordResetTokenExpiry == null ||
            user.PasswordResetTokenExpiry < DateTime.UtcNow)
        {
            return new ResetPasswordResponseDto
            {
                Success = false,
                Message = "Password reset token has expired."
            };
        }

        if (request.NewPassword != request.ConfirmPassword)
        {
            return new ResetPasswordResponseDto
            {
                Success = false,
                Message = "Passwords do not match."
            };
        }

        var samePassword =
            _passwordHasher.VerifyPassword(
                request.NewPassword,
                user.PasswordHash);

        if (samePassword)
        {
            return new ResetPasswordResponseDto
            {
                Success = false,
                Message =
                    "The new password must be different from your current password."
            };
        }

        user.PasswordHash =
            _passwordHasher.HashPassword(
                request.NewPassword);

        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiry = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);

        return new ResetPasswordResponseDto
        {
            Success = true,
            Message = "Password reset successfully."
        };
    }

    // =========================================================
    // REFRESH TOKEN
    // =========================================================

    public async Task<RefreshTokenResponseDto>
        RefreshTokenAsync(
            RefreshTokenRequestDto request)
    {
        var storedToken =
            await _refreshTokenRepository
                .GetByTokenAsync(
                    request.RefreshToken);

        if (storedToken == null)
        {
            return new RefreshTokenResponseDto
            {
                Success = false,
                Message = "Invalid refresh token."
            };
        }

        if (storedToken.IsRevoked)
        {
            return new RefreshTokenResponseDto
            {
                Success = false,
                Message = "Refresh token has been revoked."
            };
        }

        if (storedToken.ExpiresAt < DateTime.UtcNow)
        {
            return new RefreshTokenResponseDto
            {
                Success = false,
                Message = "Refresh token has expired."
            };
        }

        var user =
            await _userRepository
                .GetByIdAsync(storedToken.UserId);

        if (user == null)
        {
            return new RefreshTokenResponseDto
            {
                Success = false,
                Message = "User not found."
            };
        }

        if (!user.IsActive)
        {
            return new RefreshTokenResponseDto
            {
                Success = false,
                Message = "Your account has been deactivated."
            };
        }

        var accessToken =
            _jwtTokenService.GenerateToken(user);

        var newRefreshToken =
            _refreshTokenService.GenerateRefreshToken();

        // Revoke old refresh token
        storedToken.IsRevoked = true;

        await _refreshTokenRepository
            .UpdateAsync(storedToken);

        // Create new refresh token
        var newToken = new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = newRefreshToken,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };

        await _refreshTokenRepository
            .AddAsync(newToken);

        return new RefreshTokenResponseDto
        {
            Success = true,
            Message = "Token refreshed successfully.",
            AccessToken = accessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1)
        };
    }
}