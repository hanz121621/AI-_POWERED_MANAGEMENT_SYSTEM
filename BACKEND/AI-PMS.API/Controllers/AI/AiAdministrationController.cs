using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
// 🌟 IMPORTANT: Replace these with your actual DbContext and Entity namespaces!
using AI_PMS.Infrastructure.Data; 
// using AI_PMS.Domain.Entities; 

namespace AI_PMS.API.Controllers.AI
{
    [ApiController]
    [Route("api/ai")]
    [Authorize(Roles = "Admin")]
    public class AiAdministrationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AiAdministrationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================================================
        // GET AI SETTINGS
        // =========================================================
        [HttpGet("settings")]
        public async Task<IActionResult> GetAiSettings()
        {
            // 🌟 Replace 'AiSettings' with your actual entity name (e.g., AiSetting)
            var settings = await _context.AiSettings.FirstOrDefaultAsync();
            
            if (settings == null)
            {
                // Return default settings if the table is empty
                return Ok(new { 
                    success = true, 
                    data = new { ModelName = "llama3.2", Endpoint = "http://localhost:11434", IsAiEnabled = true } 
                });
            }
            
            return Ok(new { success = true, data = settings });
        }

        // =========================================================
        // UPDATE AI SETTINGS
        // =========================================================
        [HttpPut("settings")]
        public async Task<IActionResult> UpdateAiSettings([FromBody] dynamic updatedSettings)
        {
            var existingSettings = await _context.AiSettings.FirstOrDefaultAsync();
            
            if (existingSettings == null)
            {
                // 🌟 You may need to map this to your actual AiSetting entity class
                // For now, we'll create a basic anonymous object structure. 
                // Ideally, instantiate your actual entity: var newSettings = new AiSetting { ... }
                return BadRequest(new { message = "Please create an AiSetting record in the database first, or update the controller to instantiate your entity." });
            }
            else
            {
                // Update existing settings
                existingSettings.ModelName = updatedSettings.modelName?.ToString() ?? existingSettings.ModelName;
                existingSettings.Endpoint = updatedSettings.endpoint?.ToString() ?? existingSettings.Endpoint;
                existingSettings.IsAiEnabled = updatedSettings.isAiEnabled != null ? Convert.ToBoolean(updatedSettings.isAiEnabled) : existingSettings.IsAiEnabled;
                existingSettings.UpdatedAt = DateTime.UtcNow;
                
                _context.AiSettings.Update(existingSettings);
                await _context.SaveChangesAsync();
            }
            
            return Ok(new { success = true, message = "AI settings updated successfully." });
        }

        // =========================================================
        // GET AI USAGE LOGS
        // =========================================================
        [HttpGet("usage-logs")]
        public async Task<IActionResult> GetAiUsageLogs()
        {
            var logs = await _context.AiUsageLogs
                .OrderByDescending(l => l.CreatedAt)
                .Take(100) // Limit to last 100 for performance
                .Select(l => new {
                    l.Id,
                    l.FeatureType,
                    l.ProjectId,
                    l.Status,
                    l.ModelUsed,
                    l.ResponseTimeMs,
                    l.ErrorMessage,
                    l.CreatedAt
                })
                .ToListAsync();

            return Ok(new { success = true, data = logs });
        }

        // =========================================================
        // GET AI SUGGESTIONS (Fallback)
        // =========================================================
        [HttpGet("suggestions")]
        public async Task<IActionResult> GetAiSuggestions()
        {
            // Return empty array for now if you don't have a dedicated suggestions table yet
            return Ok(new { success = true, data = new List<object>() });
        }
    }
}