using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers;

[ApiController]
[ApiExplorerSettings(GroupName = "AI")]
[Route("api/[controller]")]
public class AISuggestionController : ControllerBase
{
    private readonly IAISuggestionService _service;

    public AISuggestionController(IAISuggestionService service)
    {
        _service = service;
    }

    // =========================================================
    // GET ALL AI SUGGESTIONS
    // GET /api/AISuggestion
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll(
        CancellationToken cancellationToken)
    {
        var suggestions = await _service.GetAllAsync(
            cancellationToken);

        return Ok(suggestions);
    }

    // =========================================================
    // GET AI SUGGESTION BY ID
    // GET /api/AISuggestion/{id}
    // =========================================================

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var suggestion = await _service.GetByIdAsync(
            id,
            cancellationToken);

        if (suggestion == null)
        {
            return NotFound();
        }

        return Ok(suggestion);
    }

    // =========================================================
    // CREATE AI SUGGESTION
    // POST /api/AISuggestion
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] AISuggestionDto dto,
        CancellationToken cancellationToken)
    {
        var suggestion = await _service.CreateAsync(
            dto,
            cancellationToken);

        return Ok(suggestion);
    }

    // =========================================================
    // MARK AI SUGGESTION AS READ
    // PUT /api/AISuggestion/{id}/read
    // =========================================================

    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> MarkAsRead(
        Guid id,
        CancellationToken cancellationToken)
    {
        var success = await _service.MarkAsReadAsync(
            id,
            cancellationToken);

        if (!success)
        {
            return NotFound(new
            {
                message = "AI suggestion was not found."
            });
        }

        return Ok(new
        {
            message = "AI suggestion marked as read."
        });
    }
}

