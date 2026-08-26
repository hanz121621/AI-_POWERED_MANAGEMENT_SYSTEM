using AI_PMS.Application.DTOs.Teams;
using AI_PMS.Application.Interfaces.Teams;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Teams
{
    [ApiController]
    [Route("api/team-member-requests")]
    [Authorize]
    public class TeamMemberRequestsController : ControllerBase
    {
        private readonly ITeamMemberRequestService _requestService;

        public TeamMemberRequestsController(
            ITeamMemberRequestService requestService)
        {
            _requestService = requestService;
        }

        // =========================================================
        // CREATE TEAM MEMBER REQUEST
        //
        // POST:
        // api/team-member-requests
        //
        // Manager creates either:
        // ADD or REMOVE request
        // =========================================================

        [HttpPost]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> CreateRequest(
            [FromBody] CreateTeamMemberRequestDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var managerId = GetCurrentUserId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid manager identity."
                });
            }

            var result =
                await _requestService.CreateRequestAsync(
                    managerId.Value,
                    dto);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                message = result.Message,
                request = result.Request
            });
        }

        // =========================================================
        // GET ALL REQUESTS
        //
        // GET:
        // api/team-member-requests
        //
        // Admin
        // =========================================================

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllRequests()
        {
            var requests =
                await _requestService.GetAllRequestsAsync();

            return Ok(new
            {
                success = true,
                requests
            });
        }

        // =========================================================
        // GET PENDING REQUESTS
        //
        // GET:
        // api/team-member-requests/pending
        //
        // Admin
        // =========================================================

        [HttpGet("pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingRequests()
        {
            var requests =
                await _requestService.GetPendingRequestsAsync();

            return Ok(new
            {
                success = true,
                requests
            });
        }

        // =========================================================
        // GET REQUEST BY ID
        //
        // GET:
        // api/team-member-requests/{id}
        // =========================================================

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid request ID."
                });
            }

            var request =
                await _requestService.GetRequestByIdAsync(id);

            if (request == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Team member request not found."
                });
            }

            return Ok(new
            {
                success = true,
                request
            });
        }

        // =========================================================
        // GET MY REQUESTS
        //
        // GET:
        // api/team-member-requests/my
        //
        // Manager
        // =========================================================

        [HttpGet("my")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetMyRequests()
        {
            var managerId = GetCurrentUserId();

            if (!managerId.HasValue)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid manager identity."
                });
            }

            var requests =
                await _requestService.GetManagerRequestsAsync(
                    managerId.Value);

            return Ok(new
            {
                success = true,
                requests
            });
        }

        // =========================================================
        // APPROVE REQUEST
        //
        // POST:
        // api/team-member-requests/{id}/approve
        //
        // Admin
        // =========================================================

        [HttpPost("{id:guid}/approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Approve(
            Guid id,
            [FromBody] ReviewTeamMemberRequestDto? dto)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid request ID."
                });
            }

            var adminId = GetCurrentUserId();

            if (!adminId.HasValue)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid administrator identity."
                });
            }

            var result =
                await _requestService.ApproveRequestAsync(
                    adminId.Value,
                    id,
                    dto?.Comment);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                message = result.Message
            });
        }

        // =========================================================
        // REJECT REQUEST
        //
        // POST:
        // api/team-member-requests/{id}/reject
        //
        // Admin
        // =========================================================

        [HttpPost("{id:guid}/reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Reject(
            Guid id,
            [FromBody] ReviewTeamMemberRequestDto? dto)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid request ID."
                });
            }

            var adminId = GetCurrentUserId();

            if (!adminId.HasValue)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid administrator identity."
                });
            }

            var result =
                await _requestService.RejectRequestAsync(
                    adminId.Value,
                    id,
                    dto?.Comment);

            if (!result.Success)
            {
                return BadRequest(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                message = result.Message
            });
        }

        // =========================================================
        // CURRENT USER ID
        // =========================================================

        private Guid? GetCurrentUserId()
        {
            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("sub");

            if (string.IsNullOrWhiteSpace(userIdClaim))
                return null;

            return Guid.TryParse(
                userIdClaim,
                out var userId)
                ? userId
                : null;
        }
    }
}