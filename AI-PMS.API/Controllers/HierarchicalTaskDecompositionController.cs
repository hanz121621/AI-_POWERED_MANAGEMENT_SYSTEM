using AI_PMS.Application.DTOs;
using AI_PMS.Application.DTOs.Hierarchy;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[ApiExplorerSettings(GroupName = "AI")]
[Route("api/[controller]")]
[Authorize(Roles = "Developer,Staff,TeamLeader")]
public class HierarchicalTaskDecompositionController : ControllerBase
{
    private readonly IHierarchicalTaskDecompositionService
        _hierarchicalTaskDecompositionService;

    public HierarchicalTaskDecompositionController(
        IHierarchicalTaskDecompositionService
            hierarchicalTaskDecompositionService)
    {
        _hierarchicalTaskDecompositionService =
            hierarchicalTaskDecompositionService;
    }

    [HttpPost]
    public async Task<
        ActionResult<HierarchicalTaskDecompositionResponse>>
        DecomposeVeryLargeTask(
            [FromBody] TaskDecompositionRequest request)
    {
        var result =
            await _hierarchicalTaskDecompositionService
                .DecomposeVeryLargeTaskAsync(request);

        return Ok(result);
    }
}

