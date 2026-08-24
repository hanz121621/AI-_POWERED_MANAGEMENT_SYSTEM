using AI_PMS.Application.Interfaces.Security;
using Microsoft.AspNetCore.Identity;

namespace AI_PMS.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    private readonly Microsoft.AspNetCore.Identity.PasswordHasher<object>
        _hasher = new();

    public string HashPassword(string password)
    {
        return _hasher.HashPassword(
            null!,
            password);
    }

    public bool VerifyPassword(
        string password,
        string passwordHash)
    {
        var result =
            _hasher.VerifyHashedPassword(
                null!,
                passwordHash,
                password);

        return result ==
               PasswordVerificationResult.Success;
    }
}