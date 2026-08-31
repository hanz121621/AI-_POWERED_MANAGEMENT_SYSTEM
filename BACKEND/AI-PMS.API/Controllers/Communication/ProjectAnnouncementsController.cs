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
    public class ProjectAnnouncementsController : ControllerBase
    {
        private readonly IProjectAnnouncementService _announcementService;

        public ProjectAnnouncementsController(
            IProjectAnnouncementService announcementService)
        {
            _announcementService = announcementService;
        }

        // =========================================================
        // SEND PROJECT ANNOUNCEMENT
        //
        // POST:
        // api/projects/{projectId}/announcements
        // =========================================================

        [HttpPost]
        public async Task<ActionResult<ProjectAnnouncementDto>>
            SendAnnouncement(
                Guid projectId,
                [FromBody] SendProjectAnnouncementDto request)
        {
            var userIdClaim =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var managerId))
            {
                return Unauthorized(new
                {
                    message = "Invalid authenticated user."
                });
            }

            try
            {
                if (request == null)
                {
                    return BadRequest(new
                    {
                        message = "Announcement information is required."
                    });
                }

                // Route project ID is authoritative.
                request.ProjectId = projectId;

                var result =
                    await _announcementService
                        .SendAnnouncementAsync(
                            managerId,
                            request);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
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
        // GET PROJECT ANNOUNCEMENTS
        //
        // GET:
        // api/projects/{projectId}/announcements
        // =========================================================

        [HttpGet]
        public async Task<ActionResult<List<ProjectAnnouncementDto>>>
            GetAnnouncements(Guid projectId)
        {
            var userIdClaim =
                User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdClaim, out var managerId))
            {
                return Unauthorized(new
                {
                    message = "Invalid authenticated user."
                });
            }

            try
            {
                var result =
                    await _announcementService
                        .GetProjectAnnouncementsAsync(
                            managerId,
                            projectId);

                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
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
}