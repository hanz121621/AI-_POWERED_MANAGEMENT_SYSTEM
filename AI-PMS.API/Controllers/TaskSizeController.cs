using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[ApiExplorerSettings(GroupName = "AI")]
[Route("api/[controller]")]
public class TaskSizeController : ControllerBase
{
    private readonly ITaskSizeDetectionService _service;

    public TaskSizeController(
        ITaskSizeDetectionService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<TaskSizeResponse>>
        DetectTaskSize(
            [FromBody] TaskDecompositionRequest request)
    {
        var result =
            await _service.DetectTaskSizeAsync(request);

        return Ok(result);
    }
}

