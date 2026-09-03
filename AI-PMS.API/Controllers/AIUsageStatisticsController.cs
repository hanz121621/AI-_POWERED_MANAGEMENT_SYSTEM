using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[ApiExplorerSettings(GroupName = "AI")]
[Route("api/[controller]")]
public class AIUsageStatisticsController : ControllerBase
{
    private readonly IAIUsageStatisticsService _service;

    public AIUsageStatisticsController(
        IAIUsageStatisticsService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<AIUsageStatisticsResponse>> GetStatistics(
        CancellationToken cancellationToken)
    {
        var result = await _service.GetStatisticsAsync(
            cancellationToken);

        return Ok(result);
    }
}

