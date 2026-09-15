using AI_PMS.Application.DTOs.Teams;
using AI_PMS.Application.Interfaces.Teams;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AI_PMS.API.Controllers.Teams
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TeamController : ControllerBase
    {
        private readonly ITeamService _teamService;

        public TeamController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        // =========================================================
        // CREATE TEAM
        // POST: api/Team
        // =========================================================

        [HttpPost]
        public async Task<IActionResult> CreateTeam(
            [FromBody] CreateTeamDto dto)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var result =
                await _teamService.CreateTeamAsync(dto);

            if (!result.Success)
            {
                if (result.Message.Contains(
                    "already exists",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return Conflict(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message.Contains(
                    "not found",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return CreatedAtAction(
                nameof(GetTeamById),
                new
                {
                    id = result.Team!.Id
                },
                new
                {
                    message = result.Message,
                    team = result.Team
                });
        }

        // =========================================================
        // GET ALL TEAMS
        // GET: api/Team
        // =========================================================

        [HttpGet]
        public async Task<IActionResult> GetAllTeams()
        {
            var teams =
                await _teamService.GetAllTeamsAsync();

            return Ok(teams);
        }

        // =========================================================
        // GET MY ACTIVE TEAMS
        // GET: api/Team/my-teams
        //
        // Used by:
        // - Staff
        // - Developer
        // - Contributor
        //
        // Gets teams from the authenticated user's JWT identity.
        // =========================================================

        [HttpGet("my-teams")]
        [Authorize(Roles = "Contributor")]
        public async Task<IActionResult> GetMyTeams()
        {
            // -----------------------------------------------------
            // GET AUTHENTICATED USER ID
            // -----------------------------------------------------

            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(
                    userIdClaim,
                    out var userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid authenticated user."
                });
            }

            // -----------------------------------------------------
            // GET USER'S ACTIVE TEAMS
            // -----------------------------------------------------

            var teams =
                await _teamService.GetMyTeamsAsync(
                    userId);

            return Ok(new
            {
                message = teams.Any()
                    ? "Your teams retrieved successfully."
                    : "You are not currently assigned to any active teams.",

                data = teams
            });
        }

        // =========================================================
        // GET TEAM BY ID
        // GET: api/Team/{id}
        // =========================================================

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetTeamById(
            Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid team ID."
                });
            }

            var team =
                await _teamService.GetTeamByIdAsync(id);

            if (team == null)
            {
                return NotFound(new
                {
                    message = "Team not found."
                });
            }

            return Ok(team);
        }

        // =========================================================
        // UPDATE TEAM
        // PUT: api/Team/{id}
        // =========================================================

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateTeam(
            Guid id,
            [FromBody] UpdateTeamDto dto)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid team ID."
                });
            }

            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var result =
                await _teamService.UpdateTeamAsync(
                    id,
                    dto);

            if (!result.Success)
            {
                if (result.Message.Equals(
                    "Team not found.",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message.Contains(
                    "already exists",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return Conflict(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message.Contains(
                    "not found",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                team = result.Team
            });
        }

        // =========================================================
        // DELETE TEAM
        // DELETE: api/Team/{id}
        // =========================================================

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteTeam(
            Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid team ID."
                });
            }

            var result =
                await _teamService.DeleteTeamAsync(id);

            if (!result.Success)
            {
                if (result.Message.Equals(
                    "Team not found.",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message.Contains(
                    "cannot be deleted",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return Conflict(new
                    {
                        message = result.Message
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message
            });
        }

        // =========================================================
        // ASSIGN MANAGER
        // PUT: api/Team/{teamId}/manager/{managerId}
        // =========================================================

        [HttpPut("{teamId:guid}/manager/{managerId:guid}")]
        public async Task<IActionResult> AssignManager(
            Guid teamId,
            Guid managerId)
        {
            if (teamId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid team ID."
                });
            }

            if (managerId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid manager ID."
                });
            }

            var result =
                await _teamService.AssignManagerAsync(
                    teamId,
                    managerId);

            if (!result.Success)
            {
                if (result.Message.Equals(
                    "Team not found.",
                    StringComparison.OrdinalIgnoreCase) ||
                    result.Message.Equals(
                    "Manager not found.",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                teamId,
                managerId
            });
        }

        // =========================================================
        // ADD MEMBER
        // POST: api/Team/{teamId}/members
        // =========================================================

        [HttpPost("{teamId:guid}/members")]
        public async Task<IActionResult> AddMember(
            Guid teamId,
            [FromBody] AddTeamMemberDto dto)
        {
            if (teamId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid team ID."
                });
            }

            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var result =
                await _teamService.AddMemberAsync(
                    teamId,
                    dto);

            if (!result.Success)
            {
                if (result.Message.Equals(
                    "Team not found.",
                    StringComparison.OrdinalIgnoreCase) ||
                    result.Message.Equals(
                    "User not found.",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message.Contains(
                    "already part",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return Conflict(new
                    {
                        message = result.Message
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                teamId,
                userId = dto.UserId
            });
        }

        // =========================================================
        // REMOVE MEMBER
        // DELETE: api/Team/{teamId}/members/{userId}
        // =========================================================

        [HttpDelete("{teamId:guid}/members/{userId:guid}")]
        public async Task<IActionResult> RemoveMember(
            Guid teamId,
            Guid userId)
        {
            if (teamId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid team ID."
                });
            }

            if (userId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid user ID."
                });
            }

            var result =
                await _teamService.RemoveMemberAsync(
                    teamId,
                    userId);

            if (!result.Success)
            {
                if (result.Message.Equals(
                    "Team not found.",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message.Contains(
                    "not part",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                teamId,
                userId
            });
        }

        // =========================================================
        // ASSIGN TEAM LEADER
        // PUT: api/Team/{teamId}/leader/{userId}
        // =========================================================

        [HttpPut("{teamId:guid}/leader/{userId:guid}")]
        public async Task<IActionResult> AssignTeamLeader(
            Guid teamId,
            Guid userId)
        {
            if (teamId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid team ID."
                });
            }

            if (userId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid user ID."
                });
            }

            var result =
                await _teamService.AssignTeamLeaderAsync(
                    teamId,
                    userId);

            if (!result.Success)
            {
                if (result.Message.Equals(
                    "Team not found.",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message.Contains(
                    "not a member",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                teamId,
                userId
            });
        }

        // =========================================================
        // REMOVE TEAM LEADER
        // DELETE: api/Team/{teamId}/leader/{userId}
        // =========================================================

        [HttpDelete("{teamId:guid}/leader/{userId:guid}")]
        public async Task<IActionResult> RemoveTeamLeader(
            Guid teamId,
            Guid userId)
        {
            if (teamId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid team ID."
                });
            }

            if (userId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid user ID."
                });
            }

            var result =
                await _teamService.RemoveTeamLeaderAsync(
                    teamId,
                    userId);

            if (!result.Success)
            {
                if (result.Message.Equals(
                    "Team not found.",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                if (result.Message.Contains(
                    "not a member",
                    StringComparison.OrdinalIgnoreCase))
                {
                    return NotFound(new
                    {
                        message = result.Message
                    });
                }

                return BadRequest(new
                {
                    message = result.Message
                });
            }

            return Ok(new
            {
                message = result.Message,
                teamId,
                userId
            });
        }

        // =========================================================
        // GET TEAM MEMBERS
        // GET: api/Team/{teamId}/members
        // =========================================================

        [HttpGet("{teamId:guid}/members")]
        public async Task<IActionResult> GetTeamMembers(
            Guid teamId)
        {
            if (teamId == Guid.Empty)
            {
                return BadRequest(new
                {
                    message = "Invalid team ID."
                });
            }

            // -----------------------------------------------------
            // Verify team exists first.
            // -----------------------------------------------------

            var team =
                await _teamService.GetTeamByIdAsync(
                    teamId);

            if (team == null)
            {
                return NotFound(new
                {
                    message = "Team not found."
                });
            }

            var members =
                await _teamService.GetTeamMembersAsync(
                    teamId);

            return Ok(members);
        }
    }
}