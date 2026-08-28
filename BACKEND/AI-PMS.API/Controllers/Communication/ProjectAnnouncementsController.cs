using AI_PMS.Application.DTOs.Communication;
using AI_PMS.Application.Interfaces.Communication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Communication
{
    [ApiController]
    [Route("api/projects/{projectId:guid}/announcements")]
    [Authorize(Roles = "Manager")]
    public class ProjectAnnouncementsController
        : ControllerBase
    {
        private readonly IProjectAnnouncementService
            _announcementService;

        public ProjectAnnouncementsController(
            IProjectAnnouncementService announcementService)
        {
            _announcementService =
                announcementService;
        }

        // =========================================================
        // SEND ANNOUNCEMENT
        // =========================================================

        [HttpPost]
        public async Task<IActionResult>
            SendAnnouncement(
                Guid projectId,
                [FromBody] SendProjectAnnouncementDto request)
        {
            var managerIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    managerIdClaim,
                    out var managerId))
            {
                return Unauthorized();
            }

            request.ProjectId = projectId;

            var result =
                await _announcementService
                    .SendAnnouncementAsync(
                        managerId,
                        request);

            return Ok(result);
        }

        // =========================================================
        // GET PROJECT ANNOUNCEMENTS
        // =========================================================

        [HttpGet]
        public async Task<IActionResult>
            GetAnnouncements(Guid projectId)
        {
            var managerIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    managerIdClaim,
                    out var managerId))
            {
                return Unauthorized();
            }

            var result =
                await _announcementService
                    .GetProjectAnnouncementsAsync(
                        managerId,
                        projectId);

            return Ok(result);
        }
    }
}