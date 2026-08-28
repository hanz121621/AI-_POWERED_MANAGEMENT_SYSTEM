
using AI_PMS.Application.DTOs.NotificationSettings;
using AI_PMS.Application.Interfaces.Auth;
using AI_PMS.Application.Interfaces.NotificationSettings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.NotificationSettings;

[ApiController]
[Route("api/notification-settings")]
[Authorize]
public class NotificationSettingsController : ControllerBase
{
    private readonly INotificationSettingService _service;
    private readonly ICurrentUserService _currentUserService;

    public NotificationSettingsController(
        INotificationSettingService service,
        ICurrentUserService currentUserService)
    {
        _service = service;
        _currentUserService = currentUserService;
    }

    // =========================================================
    // GET MY NOTIFICATION SETTINGS
    // GET: api/notification-settings
    // =========================================================

    [HttpGet]
    public async Task<ActionResult<NotificationSettingDto>> Get()
    {
        var userId = _currentUserService.UserId;

        if (userId == Guid.Empty)
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        try
        {
            var result = await _service.GetAsync(userId);

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // =========================================================
    // UPDATE MY NOTIFICATION SETTINGS
    // PUT: api/notification-settings
    // =========================================================

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

        var userId = _currentUserService.UserId;

        if (userId == Guid.Empty)
        {
            return Unauthorized(new
            {
                message = "Invalid user identity."
            });
        }

        try
        {
            var result =
                await _service.UpdateAsync(
                    userId,
                    request);

            return Ok(new
            {
                message =
                    "Notification settings updated successfully.",

                data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }
}
