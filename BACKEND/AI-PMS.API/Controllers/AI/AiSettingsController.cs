using AI_PMS.Domain.Entities.AI;
using AI_PMS.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AI_PMS.API.Controllers.AI
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AiSettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AiSettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _context.AiSettings.FirstOrDefaultAsync();
            if (settings == null) settings = new AiSettings();
            return Ok(new { success = true, data = settings });
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSettings([FromBody] AiSettings updatedSettings)
        {
            var existing = await _context.AiSettings.FirstOrDefaultAsync();
            var previousJson = existing != null ? JsonSerializer.Serialize(existing) : "{}";

            if (existing == null)
            {
                updatedSettings.Id = Guid.NewGuid();
                updatedSettings.UpdatedAt = DateTime.UtcNow;
                _context.AiSettings.Add(updatedSettings);
            }
            else
            {
                existing.ModelName = updatedSettings.ModelName;
                existing.Endpoint = updatedSettings.Endpoint;
                existing.IsAiEnabled = updatedSettings.IsAiEnabled;
                existing.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            // 🌟 AI-002 BR6: Record in Audit Log
            var adminName = User.Identity?.Name ?? "System Administrator";
            var newJson = JsonSerializer.Serialize(existing ?? updatedSettings);
            
            var auditLog = new AiSettingsAuditLog
            {
                AdminUserName = adminName,
                PreviousSettingsJson = previousJson,
                NewSettingsJson = newJson,
                ChangedAt = DateTime.UtcNow
            };
            
            _context.AiSettingsAuditLogs.Add(auditLog);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "AI settings updated and recorded in audit log.", data = existing ?? updatedSettings });
        }
    }
}