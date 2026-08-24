using AI_PMS.Application.DTOs.NotificationSettings;
using AI_PMS.Application.Interfaces.NotificationSettings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.NotificationSettings;

[ApiController]
[Route("api/notification-settings")]
[Authorize(Roles = "Admin")]
public class NotificationSettingsController : ControllerBase
{
    private readonly INotificationSettingService _service;

    public NotificationSettingsController(
        INotificationSettingService service)
    {
        _service = service;
    }

    // GET: api/notification-settings
    [HttpGet]
    public async Task<ActionResult<NotificationSettingDto>> Get()
    {
        var result = await _service.GetAsync();

        return Ok(result);
    }

    // PUT: api/notification-settings
    [HttpPut]
    public async Task<ActionResult<NotificationSettingDto>> Update(
        [FromBody] UpdateNotificationSettingRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new
            {
                message = "Invalid notification settings."
            });
        }

        try
        {
            var result = await _service.UpdateAsync(request);

            return Ok(new
            {
                message =
                    "Notification settings updated successfully.",
                data = result
            });
        }
        catch
        {
            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message =
                        "Unable to save notification settings. Please try again."
                });
        }
    }
}