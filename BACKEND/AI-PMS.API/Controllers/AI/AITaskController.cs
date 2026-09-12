using System;
using System.Threading;
using System.Threading.Tasks;
using AI_PMS.Application.DTOs.AI;               // 🌟 Correct DTO namespace
using AI_PMS.Application.Interfaces.AI;         // 🌟 Correct Interface namespace (matches your OllamaService)
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace AI_PMS.API.Controllers.AI
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AITaskController : ControllerBase
    {
        private readonly IAIService _aiService;
        private readonly ILogger<AITaskController> _logger;

        public AITaskController(
            IAIService aiService,
            ILogger<AITaskController> logger)
        {
            _aiService = aiService;
            _logger = logger;
        }

        [HttpPost("generate-task-breakdown")]
        public async Task<IActionResult> GenerateTaskBreakdown(
            [FromBody] GenerateTaskBreakdownRequest request,
            CancellationToken cancellationToken)
        {
            try
            {
                _logger.LogInformation("Generating AI task breakdown for sprint: {SprintGoal}", request.SprintGoal);

                var result = await _aiService.GenerateTaskBreakdownAsync(
                    request.SprintGoal,
                    request.SprintDescription,
                    cancellationToken);

                return Ok(new
                {
                    Success = true,
                    Message = "Task breakdown generated successfully.",
                    Data = result.Tasks
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate task breakdown");
                return StatusCode(500, new
                {
                    Success = false,
                    Message = "Failed to generate AI task breakdown.",
                    Error = ex.Message
                });
            }
        }
    }

    public class GenerateTaskBreakdownRequest
    {
        public string SprintGoal { get; set; } = string.Empty;
        public string SprintDescription { get; set; } = string.Empty;
    }
}