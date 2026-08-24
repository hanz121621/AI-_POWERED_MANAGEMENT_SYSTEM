using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Activities
{
    [ApiController]
    [Route("api/activities")]
    [Authorize(Roles = "Admin")]
    public class ActivityLogController : ControllerBase
    {
        private readonly IActivityLogService _activityLogService;

        public ActivityLogController(
            IActivityLogService activityLogService)
        {
            _activityLogService = activityLogService;
        }

        // =========================================================
        // GET ALL ACTIVITY LOGS
        // =========================================================

        [HttpGet]
        public async Task<ActionResult<List<ActivityLogDto>>>
            GetAll()
        {
            var result =
                await _activityLogService.GetAllAsync();

            return Ok(result);
        }

        // =========================================================
        // GET ACTIVITIES BY USER
        // =========================================================

        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<List<ActivityLogDto>>>
            GetByUser(Guid userId)
        {
            var result =
                await _activityLogService.GetByUserAsync(userId);

            return Ok(result);
        }

        // =========================================================
        // GET ACTIVITIES BY DATE RANGE
        // =========================================================

        [HttpGet("date-range")]
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
        // GET ACTIVITIES BY ENTITY
        // =========================================================

        [HttpGet("entity/{entityId:guid}")]
        public async Task<ActionResult<List<ActivityLogDto>>>
            GetByEntity(Guid entityId)
        {
            var result =
                await _activityLogService.GetByEntityAsync(
                    entityId);

            return Ok(result);
        }
    }
}