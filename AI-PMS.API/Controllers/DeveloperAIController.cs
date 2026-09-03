using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[ApiExplorerSettings(GroupName = "AI")]
public class DeveloperAIController : ControllerBase
{
    private readonly IDeveloperRecommendationService
        _developerRecommendationService;

    public DeveloperAIController(
        IDeveloperRecommendationService
            developerRecommendationService)
    {
        _developerRecommendationService =
            developerRecommendationService;
    }

    [HttpGet("recommendations/{developerId:guid}")]
    public async Task<ActionResult<DeveloperRecommendationResponse>>
        GetRecommendations(Guid developerId)
    {
        if (developerId == Guid.Empty)
        {
            return BadRequest("Developer ID is required.");
        }

        var request =
            new DeveloperRecommendationRequest
            {
                DeveloperId = developerId
            };

        try
        {
            var result =
                await _developerRecommendationService
                    .GetRecommendationsAsync(request);

            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}