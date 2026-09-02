using AI_PMS.Application.Interfaces.Repositories.AI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AI_PMS.API.Controllers.AI
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AiUsageController : ControllerBase
    {
        private readonly IAiSuggestionRepository _repository;

        public AiUsageController(IAiSuggestionRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsageStatistics(
            [FromQuery] string? startDate,
            [FromQuery] string? endDate,
            [FromQuery] string? featureType,
            [FromQuery] string? projectId)
        {
            // Safely parse the query parameters to avoid 400 Bad Request errors
            DateTime? start = null;
            DateTime? end = null;
            Guid? projId = null;

            if (!string.IsNullOrWhiteSpace(startDate) && DateTime.TryParse(startDate, out var s))
                start = s;

            if (!string.IsNullOrWhiteSpace(endDate) && DateTime.TryParse(endDate, out var e))
                end = e;

            if (!string.IsNullOrWhiteSpace(projectId) && Guid.TryParse(projectId, out var p))
                projId = p;

            var logs = await _repository.GetAiUsageLogsAsync(start, end, featureType, projId);

            var statistics = new
            {
                totalRequests = logs.Count,
                successfulRequests = logs.Count(l => l.Status == "Success"),
                failedRequests = logs.Count(l => l.Status == "Failed"),
                averageResponseTime = logs.Where(l => l.ResponseTimeMs.HasValue).Any() 
                    ? logs.Where(l => l.ResponseTimeMs.HasValue).Average(l => l.ResponseTimeMs.Value) 
                    : 0,
                featureBreakdown = logs.GroupBy(l => l.FeatureType)
                    .Select(g => new
                    {
                        feature = g.Key,
                        count = g.Count(),
                        successRate = g.Count(l => l.Status == "Success") * 100.0 / g.Count()
                    }).ToList(),
                recentLogs = logs.Take(50).Select(l => new
                {
                    l.Id,
                    l.FeatureType,
                    l.ProjectId,
                    l.Status,
                    l.ModelUsed,
                    l.ResponseTimeMs,
                    l.ErrorMessage,
                    l.CreatedAt
                }).ToList()
            };

            return Ok(new { success = true, data = statistics });
        }
    }
}