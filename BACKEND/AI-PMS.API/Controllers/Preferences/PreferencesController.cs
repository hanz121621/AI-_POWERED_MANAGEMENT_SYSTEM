using AI_PMS.Application.DTOs.AIPreferences;
using AI_PMS.Application.DTOs.DashboardPreferences;
using AI_PMS.Application.Interfaces.Preferences;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Preferences;

[ApiController]
[Route("api/preferences")]
[Authorize]
public class PreferencesController : ControllerBase
{
    private readonly IPreferenceService _service;

    public PreferencesController(
        IPreferenceService service)
    {
        _service = service;
    }

    // =========================================================
    // DASHBOARD PREFERENCE
    // =========================================================

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardPreferenceDto>>
        GetDashboardPreference()
    {
        var userId = GetUserId();

        var result =
            await _service.GetDashboardPreferenceAsync(userId);

        return Ok(result);
    }

    [HttpPut("dashboard")]
    public async Task<ActionResult<DashboardPreferenceDto>>
        UpdateDashboardPreference(
            [FromBody] UpdateDashboardPreferenceDto dto)
    {
        var userId = GetUserId();

        var result =
            await _service.UpdateDashboardPreferenceAsync(
                userId,
                dto);

        return Ok(result);
    }

    // =========================================================
    // AI PREFERENCE
    // =========================================================

    [HttpGet("ai")]
    public async Task<ActionResult<AIPreferenceDto>>
        GetAIPreference()
    {
        var userId = GetUserId();

        var result =
            await _service.GetAIPreferenceAsync(userId);

        return Ok(result);
    }

    [HttpPut("ai")]
    public async Task<ActionResult<AIPreferenceDto>>
        UpdateAIPreference(
            [FromBody] UpdateAIPreferenceDto dto)
    {
        var userId = GetUserId();

        var result =
            await _service.UpdateAIPreferenceAsync(
                userId,
                dto);

        return Ok(result);
    }

    // =========================================================
    // GET USER ID FROM JWT
    // =========================================================

    private Guid GetUserId()
    {
        var value =
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        if (!Guid.TryParse(value, out var userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid user ID.");
        }

        return userId;
    }
}