using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[ApiExplorerSettings(GroupName = "AI")]
[Route("api/[controller]")]
public class ProjectProgressController : ControllerBase
{
    private readonly IProjectProgressService _service;

    public ProjectProgressController(
        IProjectProgressService service)
    {
        _service = service;
    }

    // =========================================================
    // MANUAL TEST ENDPOINT
    // POST /api/ProjectProgress
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> PredictProgress(
        [FromBody] ProjectProgressRequest request)
    {
        try
        {
            var result =
                await _service.PredictProgressAsync(request);

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
    // DATABASE PROJECT ENDPOINT
    // POST /api/ProjectProgress/project/{projectId}
    // =========================================================

    [HttpPost("project/{projectId:guid}")]
    public async Task<IActionResult> PredictProgressForProject(
        Guid projectId)
    {
        try
        {
            var result =
                await _service
                    .PredictProgressForProjectAsync(
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

