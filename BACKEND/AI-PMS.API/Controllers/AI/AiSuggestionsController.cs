using AI_PMS.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AI_PMS.API.Controllers.AI
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AiSuggestionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AiSuggestionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/aisuggestions?projectId=xxx&type=Risk&priority=High&startDate=2023-01-01&endDate=2023-12-31
        [HttpGet]
        public async Task<IActionResult> GetAiSuggestions(
            [FromQuery] Guid? projectId,
            [FromQuery] string? type,
            [FromQuery] string? priority,
            [FromQuery] string? startDate,
            [FromQuery] string? endDate)
        {
            var query = _context.AiSuggestions.AsQueryable();

            if (projectId.HasValue)
                query = query.Where(s => s.ProjectId == projectId.Value);

            if (!string.IsNullOrWhiteSpace(type))
                query = query.Where(s => s.SuggestionType == type);

            if (!string.IsNullOrWhiteSpace(priority))
                query = query.Where(s => s.Priority == priority);

            // 🌟 Safely parse and convert to UTC to satisfy PostgreSQL
            if (!string.IsNullOrWhiteSpace(startDate) && DateTime.TryParse(startDate, out var start))
            {
                var utcStart = DateTime.SpecifyKind(start, DateTimeKind.Utc);
                query = query.Where(s => s.GeneratedAt >= utcStart);
            }

            if (!string.IsNullOrWhiteSpace(endDate) && DateTime.TryParse(endDate, out var end))
            {
                // Set to the very end of the selected day in UTC so it includes the whole day
                var utcEnd = DateTime.SpecifyKind(end.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc);
                query = query.Where(s => s.GeneratedAt <= utcEnd);
            }

            var suggestions = await query
                .OrderByDescending(s => s.GeneratedAt)
                .Select(s => new 
                {
                    s.Id,
                    s.ProjectId,
                    s.SuggestionType,
                    s.Title,
                    s.Description,
                    s.Priority,
                    s.GeneratedAt,
                    s.ViewedAt
                })
                .ToListAsync();

            return Ok(new { success = true, data = suggestions });
        }

        // GET: api/aisuggestions/{id}/view (Records the access activity - BR7)
        [HttpGet("{id:guid}/view")]
        public async Task<IActionResult> ViewSuggestion(Guid id)
        {
            var suggestion = await _context.AiSuggestions.FindAsync(id);
            if (suggestion == null)
            {
                return NotFound(new { success = false, message = "AI suggestion not found." });
            }

            // Record access activity
            suggestion.ViewedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = suggestion });
        }
    }
}