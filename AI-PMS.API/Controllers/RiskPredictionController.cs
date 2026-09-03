using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[ApiExplorerSettings(GroupName = "AI")]
[Route("api/[controller]")]
public class RiskPredictionController : ControllerBase
{
    private readonly IRiskPredictionService _riskPredictionService;

    public RiskPredictionController(
        IRiskPredictionService riskPredictionService)
    {
        _riskPredictionService = riskPredictionService;
    }

    [HttpPost]
    public async Task<ActionResult<RiskPredictionResponse>> PredictRisk(
        RiskPredictionRequest request)
    {
        var result =
            await _riskPredictionService.PredictRiskAsync(request);

        return Ok(result);
    }
}

