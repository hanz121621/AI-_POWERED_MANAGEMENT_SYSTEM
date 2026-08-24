using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Activities
{
    [ApiController]
    [Route("api/audit-logs")]
    [Authorize(Roles = "Admin")]
    public class AuditLogController : ControllerBase
    {
        private readonly IAuditLogService _auditLogService;

        public AuditLogController(
            IAuditLogService auditLogService)
        {
            _auditLogService = auditLogService;
        }

        // =========================================================
        // GET ALL AUDIT LOGS
        // =========================================================

        [HttpGet]
        public async Task<ActionResult<List<AuditLogDto>>> GetAll()
        {
            var result =
                await _auditLogService.GetAllAsync();

            return Ok(result);
        }

        // =========================================================
        // GET AUDIT LOGS BY USER
        // =========================================================

        [HttpGet("user/{userId:guid}")]
        public async Task<ActionResult<List<AuditLogDto>>> GetByUser(
            Guid userId)
        {
            var result =
                await _auditLogService.GetByUserAsync(userId);

            return Ok(result);
        }

        // =========================================================
        // GET AUDIT LOGS BY ENTITY
        // =========================================================

        [HttpGet("entity/{entityId:guid}")]
        public async Task<ActionResult<List<AuditLogDto>>> GetByEntity(
            Guid entityId)
        {
            var result =
                await _auditLogService.GetByEntityAsync(entityId);

            return Ok(result);
        }

        // =========================================================
        // GET AUDIT LOGS BY DATE RANGE
        // =========================================================

        [HttpGet("date-range")]
        public async Task<ActionResult<List<AuditLogDto>>> GetByDateRange(
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            var result =
                await _auditLogService.GetByDateRangeAsync(
                    startDate,
                    endDate);

            return Ok(result);
        }

        // =========================================================
        // GET AUDIT LOGS BY ACTION
        // =========================================================

        [HttpGet("action")]
        public async Task<ActionResult<List<AuditLogDto>>> GetByAction(
            [FromQuery] string action)
        {
            if (string.IsNullOrWhiteSpace(action))
            {
                return BadRequest(new
                {
                    message = "Action is required."
                });
            }

            var result =
                await _auditLogService.GetByActionAsync(action);

            return Ok(result);
        }
    }
}