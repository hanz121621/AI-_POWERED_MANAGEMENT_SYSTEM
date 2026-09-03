using AI_PMS.Application.Interfaces.AI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI_PMS.API.Controllers.AI
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AIController : ControllerBase
    {
        private readonly IAiSuggestionService _aiSuggestionService;

        public AIController(IAiSuggestionService aiSuggestionService)
        {
            _aiSuggestionService = aiSuggestionService;
        }

        [HttpPost("test")]
        public async Task<IActionResult> TestConnection([FromBody] TestAiRequest request)
        {
            if (string.IsNullOrWhiteSpace(request?.Prompt))
            {
                return BadRequest(new { message = "Prompt is required." });
            }

            try
            {
                var response = await _aiSuggestionService.TestAiConnectionAsync(request.Prompt);
                return Ok(new { success = true, response = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }

    public class TestAiRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}