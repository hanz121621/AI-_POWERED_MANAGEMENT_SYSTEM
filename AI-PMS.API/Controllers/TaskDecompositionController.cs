using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[ApiExplorerSettings(GroupName = "AI")]
[Route("api/[controller]")]
[AllowAnonymous]

public class TaskDecompositionController : ControllerBase
{
    private readonly ITaskDecompositionService _taskDecompositionService;
    private readonly ITaskSizeDetectionService _taskSizeDetectionService;

    public TaskDecompositionController(
        ITaskDecompositionService taskDecompositionService,
        ITaskSizeDetectionService taskSizeDetectionService)
    {
        _taskDecompositionService = taskDecompositionService;
        _taskSizeDetectionService = taskSizeDetectionService;
    }

    [HttpPost]
    public async Task<ActionResult<TaskDecompositionResponse>> DecomposeTask(
        [FromBody] TaskDecompositionRequest request)
    {
        if (request == null)
        {
            return BadRequest("Task request is required.");
        }

        // STEP 1:
        // Detect the size of the task.
        var taskSizeResponse =
            await _taskSizeDetectionService
                .DetectTaskSizeAsync(request);

        // STEP 2:
        // Decompose the task using the detected size.
        var result =
            await _taskDecompositionService
                .DecomposeTaskAsync(
                    request,
                    taskSizeResponse.Size);

        return Ok(result);
    }
}

