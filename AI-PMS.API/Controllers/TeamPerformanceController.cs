using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamPerformanceController : ControllerBase
{
    private readonly ITeamPerformanceService _service;

    public TeamPerformanceController(
        ITeamPerformanceService service)
    {
        _service = service;
    }

    // =========================================================
    // POST /api/TeamPerformance
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Analyze(
        [FromBody] TeamPerformanceRequest request)
    {
        try
        {
            var result =
                await _service.AnalyzeTeamPerformanceAsync(request);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
    }

    // =========================================================
    // POST /api/TeamPerformance/project/{projectId}
    // =========================================================

    [HttpPost("project/{projectId:guid}")]
    public async Task<IActionResult> AnalyzeProject(
        Guid projectId)
    {
        try
        {
            var result =
                await _service
                    .AnalyzeTeamPerformanceForProjectAsync(
                        projectId);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
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