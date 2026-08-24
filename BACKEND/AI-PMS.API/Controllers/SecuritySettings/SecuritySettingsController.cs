using AI_PMS.Application.DTOs.SecuritySettings;
using AI_PMS.Application.Interfaces.SecuritySettings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.SecuritySettings;

[ApiController]
[Route("api/security-settings")]
[Authorize(Roles = "Admin")]
public class SecuritySettingsController : ControllerBase
{
    private readonly ISecuritySettingService _service;

    public SecuritySettingsController(
        ISecuritySettingService service)
    {
        _service = service;
    }

    // GET: api/security-settings
    [HttpGet]
    public async Task<ActionResult<SecuritySettingDto>> Get()
    {
        try
        {
            var result = await _service.GetAsync();

            return Ok(result);
        }
        catch
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "Unable to load security settings. Please try again."
                });
        }
    }

    // PUT: api/security-settings
    [HttpPut]
    public async Task<ActionResult<SecuritySettingDto>> Update(
        [FromBody] UpdateSecuritySettingRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new
            {
                message = "Invalid security configuration."
            });
        }

        try
        {
            var result = await _service.UpdateAsync(request);

            return Ok(new
            {
                message =
                    "Security settings updated successfully.",
                data = result
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
                        "Unable to update security settings. Please try again."
                });
        }
    }
}