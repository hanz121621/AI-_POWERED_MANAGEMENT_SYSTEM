using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Activities
{
    [ApiController]
    [Route("api/activities")]
    public class ActivityLogController : ControllerBase
    {
        private readonly IActivityLogService _activityLogService;

        public ActivityLogController(
            IActivityLogService activityLogService)
        {
            _activityLogService = activityLogService;
        }

        // =========================================================
        // ADMIN - GET ALL ACTIVITY LOGS
        // =========================================================

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<ActivityLogDto>>>
            GetAll()
        {
            var result =
                await _activityLogService.GetAllAsync();

            return Ok(result);
        }

        // =========================================================
        // ADMIN - GET ACTIVITIES BY USER
        // =========================================================

        [HttpGet("user/{userId:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<ActivityLogDto>>>
            GetByUser(Guid userId)
        {
            var result =
                await _activityLogService.GetByUserAsync(userId);

            return Ok(result);
        }

        // =========================================================
        // ADMIN - GET ACTIVITIES BY DATE RANGE
        // =========================================================

        [HttpGet("date-range")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<ActivityLogDto>>>
            GetByDateRange(
                [FromQuery] DateTime? startDate,
                [FromQuery] DateTime? endDate)
        {
            var result =
                await _activityLogService.GetByDateRangeAsync(
                    startDate,
                    endDate);

            return Ok(result);
        }

        // =========================================================
        // ADMIN - GET ACTIVITIES BY ENTITY
        // =========================================================

        [HttpGet("entity/{entityId:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<ActivityLogDto>>>
            GetByEntity(Guid entityId)
        {
            var result =
                await _activityLogService.GetByEntityAsync(
                    entityId);

            return Ok(result);
        }

        // =========================================================
        // COMM-004
        // PROJECT MANAGER ACTIVITY FEED
        // =========================================================

        [HttpGet("manager/feed")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<List<ActivityLogDto>>>
            GetManagerFeed(
                [FromQuery] Guid? projectId = null,
                [FromQuery] Guid? teamId = null,
                [FromQuery] string? activityType = null,
                [FromQuery] DateTime? startDate = null,
                [FromQuery] DateTime? endDate = null)
        {
            // -----------------------------------------------------
            // Identify authenticated Manager
            // -----------------------------------------------------

            var userIdClaim =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var managerId))
            {
                return Unauthorized(new
                {
                    message = "Authenticated Manager identity could not be determined."
                });
            }

            // -----------------------------------------------------
            // Retrieve authorized activities
            // -----------------------------------------------------

            var result =
                await _activityLogService.GetManagerFeedAsync(
                    managerId,
                    projectId,
                    teamId,
                    activityType,
                    startDate,
                    endDate);

            return Ok(result);
        }

        // =========================================================
        // COMM-004
        // VIEW SINGLE ACTIVITY
        // =========================================================

        [HttpGet("manager/{activityId:guid}")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<ActivityLogDto>>
            GetManagerActivity(Guid activityId)
        {
            var userIdClaim =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var managerId))
            {
                return Unauthorized(new
                {
                    message = "Authenticated Manager identity could not be determined."
                });
            }

            var result =
                await _activityLogService
                    .GetManagerActivityByIdAsync(
                        managerId,
                        activityId);

            if (result == null)
            {
                return NotFound(new
                {
                    message = "Activity not found or you are not authorized to view it."
                });
            }

            return Ok(result);
        }
    }
}