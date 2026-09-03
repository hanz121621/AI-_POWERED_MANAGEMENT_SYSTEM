using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(GroupName = "AI")]
public class StaffAIController : ControllerBase
{
    private readonly IStaffAIService _staffAIService;

    public StaffAIController(
        IStaffAIService staffAIService)
    {
        _staffAIService = staffAIService;
    }

    [HttpPost("analyze")]
    public async Task<ActionResult<StaffAIResponse>> Analyze(
        [FromBody] StaffAIRequest request)
    {
        try
        {
            var result =
                await _staffAIService
                    .AnalyzeAsync(request);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(
                StatusCodes.Status503ServiceUnavailable,
                ex.Message);
        }
    }
}