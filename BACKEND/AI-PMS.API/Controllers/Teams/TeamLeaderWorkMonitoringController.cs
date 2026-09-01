
using AI_PMS.Application.Interfaces.Teams;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Teams
{
    [ApiController]
    [Route("api/teams")]
    [Authorize(Roles = "Manager")]
    public class TeamLeaderWorkMonitoringController
        : ControllerBase
    {
        private readonly ITeamLeaderWorkMonitoringService
            _monitoringService;

        public TeamLeaderWorkMonitoringController(
            ITeamLeaderWorkMonitoringService monitoringService)
        {
            _monitoringService = monitoringService;
        }

        // =========================================================
        // TEAM-M-004
        // MONITOR TEAM LEADER WORK
        // =========================================================

        [HttpGet("{teamId:guid}/team-leader/work-monitoring")]
        public async Task<IActionResult> MonitorTeamLeaderWork(
            Guid teamId)
        {
            // -----------------------------------------------------
            // GET CURRENT MANAGER FROM JWT
            // -----------------------------------------------------

            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new
                {
                    message = "User identity could not be determined."
                });
            }

            if (!Guid.TryParse(
                    userIdClaim.Value,
                    out var managerId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user identity."
                });
            }
            // -----------------------------------------------------
            // READ-ONLY MONITORING
            // -----------------------------------------------------

            var result =
                await _monitoringService
                    .MonitorTeamLeaderWorkAsync(
                        managerId,
                        teamId);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                data = result.Data
            });
        }
    }
}
