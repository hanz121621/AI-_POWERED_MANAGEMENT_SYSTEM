using AI_PMS.Application.DTOs.SystemSettings;
using AI_PMS.Application.Interfaces.SystemSettings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.SystemSettings;

[ApiController]
[Route("api/system-settings")]
[Authorize(Roles = "Admin")]
public class SystemSettingsController : ControllerBase
{
    private readonly ISystemSettingService _service;

    public SystemSettingsController(
        ISystemSettingService service)
    {
        _service = service;
    }

    // =========================================================
    // GET SETTINGS
    // =========================================================

    [HttpGet]
    public async Task<ActionResult<SystemSettingDto>> Get()
    {
        var settings = await _service.GetAsync();

        return Ok(settings);
    }

    // =========================================================
    // UPDATE SETTINGS
    // =========================================================

    [HttpPut]
    public async Task<ActionResult<SystemSettingDto>> Update(
        [FromBody] UpdateSystemSettingRequestDto request)
    {
        try
        {
            var settings =
                await _service.UpdateAsync(request);

            return Ok(new
            {
                Success = true,
                Message = "System settings updated successfully.",
                Data = settings
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                Success = false,
                Message = ex.Message
            });
        }
    }
}