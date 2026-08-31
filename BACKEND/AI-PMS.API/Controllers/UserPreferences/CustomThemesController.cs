using System.Security.Claims;
using AI_PMS.Application.DTOs.UserPreferences;
using AI_PMS.Application.Interfaces.UserPreferences;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.UserPreferences;

[ApiController]
[Route("api/user-preferences/custom-themes")]
[Authorize]
public class CustomThemesController : ControllerBase
{
private readonly IUserPreferenceService _service;


public CustomThemesController(
    IUserPreferenceService service)
{
    _service = service;
}

// =========================================================
// GET MY CUSTOM THEMES
// =========================================================
//
// Works for:
// Admin
// Manager
// Developer
// Staff
// Team Leader
//
// Each user can only see their own custom themes.
// =========================================================

[HttpGet]
public async Task<ActionResult<List<CustomThemeDto>>> GetMyThemes()
{
    try
    {
        var userId = GetUserId();

        var result =
            await _service.GetCustomThemesAsync(userId);

        return Ok(result);
    }
    catch (UnauthorizedAccessException ex)
    {
        return Unauthorized(new
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
                    "Unable to retrieve your custom themes."
            });
    }
}

// =========================================================
// GET ONE CUSTOM THEME
// =========================================================

[HttpGet("{themeId:guid}")]
public async Task<ActionResult<CustomThemeDto>> GetTheme(
    Guid themeId)
{
    try
    {
        var userId = GetUserId();

        var result =
            await _service.GetCustomThemeByIdAsync(
                userId,
                themeId);

        if (result == null)
        {
            return NotFound(new
            {
                message =
                    "Custom theme not found."
            });
        }

        return Ok(result);
    }
    catch (UnauthorizedAccessException ex)
    {
        return Unauthorized(new
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
                    "Unable to retrieve the custom theme."
            });
    }
}

// =========================================================
// CREATE CUSTOM THEME
// =========================================================

[HttpPost]
public async Task<ActionResult<CustomThemeDto>> CreateTheme(
    [FromBody] CreateCustomThemeDto request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(new
        {
            message =
                "Invalid custom theme data."
        });
    }

    try
    {
        var userId = GetUserId();

        var result =
            await _service.CreateCustomThemeAsync(
                userId,
                request);

        return CreatedAtAction(
            nameof(GetTheme),
            new
            {
                themeId = result.Id
            },
            new
            {
                message =
                    "Custom theme created successfully.",
                data = result
            });
    }
    catch (UnauthorizedAccessException ex)
    {
        return Unauthorized(new
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
                    "Unable to create custom theme. Please try again."
            });
    }
}

// =========================================================
// UPDATE CUSTOM THEME
// =========================================================

[HttpPut("{themeId:guid}")]
public async Task<ActionResult<CustomThemeDto>> UpdateTheme(
    Guid themeId,
    [FromBody] UpdateCustomThemeDto request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(new
        {
            message =
                "Invalid custom theme data."
        });
    }

    try
    {
        var userId = GetUserId();

        var result =
            await _service.UpdateCustomThemeAsync(
                userId,
                themeId,
                request);

        if (result == null)
        {
            return NotFound(new
            {
                message =
                    "Custom theme not found."
            });
        }

        return Ok(new
        {
            message =
                "Custom theme updated successfully.",
            data = result
        });
    }
    catch (UnauthorizedAccessException ex)
    {
        return Unauthorized(new
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
                    "Unable to update custom theme. Please try again."
            });
    }
}

// =========================================================
// DELETE CUSTOM THEME
// =========================================================

[HttpDelete("{themeId:guid}")]
public async Task<IActionResult> DeleteTheme(
    Guid themeId)
{
    try
    {
        var userId = GetUserId();

        var deleted =
            await _service.DeleteCustomThemeAsync(
                userId,
                themeId);

        if (!deleted)
        {
            return NotFound(new
            {
                message =
                    "Custom theme not found."
            });
        }

        return Ok(new
        {
            message =
                "Custom theme deleted successfully."
        });
    }
    catch (UnauthorizedAccessException ex)
    {
        return Unauthorized(new
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
                    "Unable to delete custom theme. Please try again."
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
