using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Developer,Staff,TeamLeader")]
[ApiExplorerSettings(GroupName = "AI")]
public class TaskAnalysisController : ControllerBase
{
    private readonly ITaskAnalysisService _taskAnalysisService;

    public TaskAnalysisController(
        ITaskAnalysisService taskAnalysisService)
    {
        _taskAnalysisService = taskAnalysisService;
    }

    [HttpPost]
    public async Task<ActionResult<TaskAnalysisResponse>> AnalyzeTask(
        [FromBody] TaskAnalysisRequest request)
    {
        var result =
            await _taskAnalysisService
                .AnalyzeTaskAsync(request);

        return Ok(result);
    }
}