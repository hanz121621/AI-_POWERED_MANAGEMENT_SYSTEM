using AI_PMS.Application.DTOs.Teams;
using AI_PMS.Application.Interfaces.Teams;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
            var result =
                await _teamService.CreateTeamAsync(dto);

            if (!result.Success)
                return BadRequest(new
                {
                    message = result.Message
                });

            return Ok(result.Team);
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
        // GET TEAM BY ID
        // GET: api/Team/{id}
        // =========================================================

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetTeamById(
            Guid id)
        {
            var team =
                await _teamService.GetTeamByIdAsync(id);

            if (team == null)
                return NotFound(new
                {
                    message = "Team not found."
                });

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
            var result =
                await _teamService.UpdateTeamAsync(id, dto);

            if (!result.Success)
                return BadRequest(new
                {
                    message = result.Message
                });

            return Ok(result.Team);
        }

        // =========================================================
        // DELETE TEAM
        // DELETE: api/Team/{id}
        // =========================================================

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteTeam(
            Guid id)
        {
            var result =
                await _teamService.DeleteTeamAsync(id);

            if (!result.Success)
                return BadRequest(new
                {
                    message = result.Message
                });

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
            var result =
                await _teamService.AssignManagerAsync(
                    teamId,
                    managerId);

            if (!result.Success)
                return BadRequest(new
                {
                    message = result.Message
                });

            return Ok(new
            {
                message = result.Message
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
            var result =
                await _teamService.AddMemberAsync(
                    teamId,
                    dto);

            if (!result.Success)
                return BadRequest(new
                {
                    message = result.Message
                });

            return Ok(new
            {
                message = result.Message
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
            var result =
                await _teamService.RemoveMemberAsync(
                    teamId,
                    userId);

            if (!result.Success)
                return BadRequest(new
                {
                    message = result.Message
                });

            return Ok(new
            {
                message = result.Message
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
            var members =
                await _teamService.GetTeamMembersAsync(teamId);

            return Ok(members);
        }
    }
}