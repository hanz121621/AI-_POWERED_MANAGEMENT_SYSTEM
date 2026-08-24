using AI_PMS.Application.DTOs.Activities;
using AI_PMS.Application.Interfaces.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.Activities
{
    [ApiController]
    [Route("api/dashboard")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardAnalyticsService _dashboardAnalyticsService;
        private readonly IDashboardSectionService _dashboardSectionService;

        public DashboardController(
            IDashboardAnalyticsService dashboardAnalyticsService,
            IDashboardSectionService dashboardSectionService)
        {
            _dashboardAnalyticsService = dashboardAnalyticsService;
            _dashboardSectionService = dashboardSectionService;
        }

        // =========================================================
        // GET COMPLETE DASHBOARD
        // =========================================================

        [HttpGet]
        public async Task<ActionResult<DashboardAnalyticsDto>>
            GetDashboard(
                [FromQuery] DateTime? startDate = null,
                [FromQuery] DateTime? endDate = null,
                [FromQuery] Guid? projectId = null,
                [FromQuery] Guid? teamId = null,
                [FromQuery] Guid? userId = null)
        {
            var result =
                await _dashboardAnalyticsService
                    .GetDashboardAnalyticsAsync(
                        startDate,
                        endDate,
                        projectId,
                        teamId,
                        userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // =========================================================
        // GET DASHBOARD SECTION
        // =========================================================

        [HttpGet("section/{section}")]
        public async Task<ActionResult<DashboardAnalyticsDto>>
            GetSection(
                string section,
                [FromQuery] DateTime? startDate = null,
                [FromQuery] DateTime? endDate = null,
                [FromQuery] Guid? projectId = null,
                [FromQuery] Guid? teamId = null,
                [FromQuery] Guid? userId = null)
        {
            var result =
                await _dashboardSectionService.GetSectionAsync(
                    section,
                    startDate,
                    endDate,
                    projectId,
                    teamId,
                    userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}