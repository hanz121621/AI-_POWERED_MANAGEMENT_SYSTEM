using System.Security.Claims;
using AI_PMS.Application.Interfaces.Auth;
using Microsoft.AspNetCore.Http;

namespace AI_PMS.API.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(
        IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid UserId
    {
        get
        {
            var value = _httpContextAccessor
                .HttpContext?
                .User?
                .FindFirstValue(ClaimTypes.NameIdentifier);

            return Guid.TryParse(value, out var userId)
                ? userId
                : Guid.Empty;
        }
    }

    public string? Role
    {
        get
        {
            return _httpContextAccessor
                .HttpContext?
                .User?
                .FindFirstValue(ClaimTypes.Role);
        }
    }

    public bool IsAuthenticated
    {
        get
        {
            return _httpContextAccessor
                .HttpContext?
                .User?
                .Identity?
                .IsAuthenticated == true;
        }
    }
}