using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[ApiExplorerSettings(GroupName = "AI")]
[Route("api/[controller]")]
public class DeadlinePredictionController : ControllerBase
{
    private readonly IDeadlinePredictionService _service;

    public DeadlinePredictionController(
        IDeadlinePredictionService service)
    {
        _service = service;
    }

    // =========================================================
    // MANUAL TEST ENDPOINT
    // POST /api/DeadlinePrediction
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> PredictDeadline(
        [FromBody] DeadlinePredictionRequest request)
    {
        try
        {
            var result =
                await _service.PredictDeadlineAsync(request);

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
    // POST /api/DeadlinePrediction/project/{projectId}
    // =========================================================

    [HttpPost("project/{projectId:guid}")]
    public async Task<IActionResult> PredictDeadlineForProject(
        Guid projectId)
    {
        try
        {
            var result =
                await _service
                    .PredictDeadlineForProjectAsync(projectId);

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

