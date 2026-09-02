using System.Security.Claims;
using AI_PMS.Application.DTOs.UserPreferences;
using AI_PMS.Application.Interfaces.UserPreferences;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.UserPreferences;

[ApiController]
[Route("api/user-preferences")]
[Authorize]
public class UserPreferencesController : ControllerBase
{
    private readonly IUserPreferenceService _service;

    public UserPreferencesController(
        IUserPreferenceService service)
    {
        _service = service;
    }

    // =========================================================
    // GET SUPPORTED LANGUAGES
    // DEV-SETTING-002
    // =========================================================

    [HttpGet("languages")]
    public async Task<ActionResult<List<string>>>
        GetSupportedLanguages()
    {
        try
        {
            var result =
                await _service.GetSupportedLanguagesAsync();

            return Ok(result);
        }
        catch
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "Unable to retrieve supported languages."
                });
        }
    }

    // =========================================================
    // GET USER PREFERENCES
    // =========================================================

    [HttpGet]
    public async Task<ActionResult<UserPreferenceDto>> Get()
    {
        try
        {
            var userId = GetUserId();

            var result =
                await _service.GetAsync(userId);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }

    // =========================================================
    // UPDATE USER PREFERENCES
    // DEV-SETTING-002 + DEV-SETTING-003
    // STAFF-SETTING-002 + STAFF-SETTING-003
    // =========================================================

    [HttpPut]
    public async Task<ActionResult<UserPreferenceDto>> Update(
        [FromBody] UpdateUserPreferenceDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new
            {
                message =
                    "Invalid user preference settings."
            });
        }

        try
        {
            var userId = GetUserId();

            var result =
                await _service.UpdateAsync(
                    userId,
                    request);

            return Ok(new
            {
                message =
                    "User preferences updated successfully.",
                data = result
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
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
        catch
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "Unable to update user preferences. Please try again."
                });
        }
    }

    // =========================================================
    // GET CURRENT USER ID FROM JWT
    // =========================================================

    private Guid GetUserId()
    {
        var claim =
            User.FindFirstValue(
                ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        if (!Guid.TryParse(
                claim,
                out var userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid user identity.");
        }

        return userId;
    }
}