using AI_PMS.Application.DTOs.AI;
using AI_PMS.Application.Interfaces.AI;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AIController : ControllerBase
{
    private readonly IAIService _aiService;

    public AIController(IAIService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("generate")]
    public async Task<ActionResult<AIResponse>> Generate(
        [FromBody] AIRequest request)
    {
        if (request == null ||
            string.IsNullOrWhiteSpace(request.Prompt))
        {
            return BadRequest(new AIResponse
            {
                Success = false,
                ErrorMessage = "Prompt is required."
            });
        }

        var response =
            await _aiService.GenerateResponseAsync(request);

        if (!response.Success)
        {
            return StatusCode(
                StatusCodes.Status502BadGateway,
                response);
        }

        return Ok(response);
    }
    [HttpPost("suggestions")]
public async Task<ActionResult<List<AISuggestion>>> GenerateSuggestions(
    [FromBody] AISuggestionRequest request)
{
    if (request == null)
    {
        return BadRequest(new
        {
            success = false,
            errorMessage = "AI suggestion request is required."
        });
    }

    if (string.IsNullOrWhiteSpace(request.Context))
    {
        return BadRequest(new
        {
            success = false,
            errorMessage = "Context is required."
        });
    }

    var suggestions =
        await _aiService.GenerateSuggestionsAsync(request);

    if (suggestions == null || suggestions.Count == 0)
    {
        return Ok(new List<AISuggestion>());
    }

    return Ok(suggestions);
}
}