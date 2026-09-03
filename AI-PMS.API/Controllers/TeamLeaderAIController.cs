using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace AI_PMS.API.Controllers;
[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(GroupName = "AI")]
public class TeamLeaderAIController : ControllerBase
{
    private readonly ITeamLeaderAIService _teamLeaderAIService;
    public TeamLeaderAIController(
        ITeamLeaderAIService teamLeaderAIService)
    {
        _teamLeaderAIService = teamLeaderAIService;
    }
    [HttpPost("analyze/{projectId:guid}")]
    public async Task<ActionResult<TeamLeaderAIResponse>> Analyze(
        Guid projectId)
    {
        try
        {
            var result =
                await _teamLeaderAIService
                    .AnalyzeProjectAsync(projectId);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                ex.Message);
        }
    }
}
