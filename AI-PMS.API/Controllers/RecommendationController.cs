using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[ApiExplorerSettings(GroupName = "AI")]
[Route("api/[controller]")]
public class RecommendationController : ControllerBase
{
    private readonly IRecommendationService _recommendationService;

    public RecommendationController(
        IRecommendationService recommendationService)
    {
        _recommendationService = recommendationService;
    }

    [HttpPost]
    public async Task<ActionResult<RecommendationResponse>> GetRecommendations(
        [FromBody] RecommendationRequest request)
    {
        var result =
            await _recommendationService.GetRecommendationsAsync(request);

        return Ok(result);
    }
}

