using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BottleneckDetectionController : ControllerBase
{
    private readonly IBottleneckDetectionService _service;

    public BottleneckDetectionController(
        IBottleneckDetectionService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<BottleneckResponse>> DetectBottlenecks(
        [FromBody] BottleneckRequest request)
    {
        var result =
            await _service.DetectBottlenecksAsync(request);

        return Ok(result);
    }

    [HttpPost("project/{projectId:guid}")]
    public async Task<ActionResult<BottleneckResponse>>
        DetectBottlenecksForProject(Guid projectId)
    {
        var result =
            await _service.DetectBottlenecksForProjectAsync(projectId);

        return Ok(result);
    }
}