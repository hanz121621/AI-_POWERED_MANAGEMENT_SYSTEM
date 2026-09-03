using System;
using System.Threading.Tasks;
using AI_PMS.Application.Interfaces.Repositories.AI;
using AI_PMS.Domain.Entities.AI;
using AI_PMS.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
namespace AI_PMS.Infrastructure.Repositories.AI
{
    public class AiSuggestionRepository : IAiSuggestionRepository
    {
        private readonly ApplicationDbContext _context;

        public AiSuggestionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(AiSuggestion suggestion)
        {
            await _context.AiSuggestions.AddAsync(suggestion);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
        public async Task<AiSettings> GetAiSettingsAsync()
{
    return await _context.AiSettings.FirstOrDefaultAsync();
}
public async Task<AiUsageLog> LogAiUsageAsync(AiUsageLog usageLog)
{
    await _context.AiUsageLogs.AddAsync(usageLog);
    await _context.SaveChangesAsync();
    return usageLog;
}

public async Task<List<AiUsageLog>> GetAiUsageLogsAsync(DateTime? startDate = null, DateTime? endDate = null, string? featureType = null, Guid? projectId = null)
{
    var query = _context.AiUsageLogs.AsQueryable();

    if (startDate.HasValue)
        query = query.Where(l => l.CreatedAt >= startDate.Value);

    if (endDate.HasValue)
        query = query.Where(l => l.CreatedAt <= endDate.Value);

    if (!string.IsNullOrWhiteSpace(featureType))
        query = query.Where(l => l.FeatureType == featureType);

    if (projectId.HasValue)
        query = query.Where(l => l.ProjectId == projectId.Value);

    return await query.OrderByDescending(l => l.CreatedAt).ToListAsync();
}
public async Task UpdateAiSettingsAsync(AiSettings settings)
{
    var existing = await _context.AiSettings.FirstOrDefaultAsync();
    
    if (existing == null)
    {
        settings.Id = Guid.NewGuid();
        settings.UpdatedAt = DateTime.UtcNow;
        await _context.AiSettings.AddAsync(settings);
    }
    else
    {
        existing.ModelName = settings.ModelName;
        existing.Endpoint = settings.Endpoint;
        existing.IsAiEnabled = settings.IsAiEnabled;
        existing.UpdatedAt = DateTime.UtcNow;
    }
    
    await _context.SaveChangesAsync();
}
    }
}