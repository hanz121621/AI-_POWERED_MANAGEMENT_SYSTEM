using System.Security.Claims;

namespace AI_PMS.Application.Interfaces.Auth;

public interface ICurrentUserService
{
    Guid UserId { get; }

    string? Role { get; }

    bool IsAuthenticated { get; }
}