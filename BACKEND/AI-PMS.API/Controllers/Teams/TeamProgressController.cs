
using AI_PMS.Application.Interfaces.Teams;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Teams
{
    [ApiController]
    [Route("api/teams")]
    [Authorize(Roles = "Manager")]
    public class TeamProgressController : ControllerBase
    {
        private readonly ITeamProgressService _service;

        public TeamProgressController(
            ITeamProgressService service)
        {
            _service = service;
        }


        // =========================================================
        // TEAM-M-005
        // REVIEW TEAM PROGRESS
        // =========================================================

        [HttpGet("{teamId:guid}/progress")]
        public async Task<IActionResult> ReviewTeamProgress(
            Guid teamId)
        {
            // -----------------------------------------------------
            // GET CURRENT AUTHENTICATED MANAGER
            // -----------------------------------------------------

            var managerIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(
                    managerIdClaim,
                    out var managerId))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Authenticated Manager identity could not be determined."
                });
            }


            // -----------------------------------------------------
            // REVIEW TEAM PROGRESS
            // -----------------------------------------------------

            var result =
                await _service.ReviewTeamProgressAsync(
                    managerId,
                    teamId);


            // -----------------------------------------------------
            // AUTHORIZATION / NOT FOUND
            // -----------------------------------------------------

            if (!result.Success)
            {
                return Forbid();
            }


            // -----------------------------------------------------
            // SUCCESS
            // -----------------------------------------------------

            return Ok(new
            {
                success = true,
                message = result.Message,
                data = result.Data
            });
        }
    }
}
