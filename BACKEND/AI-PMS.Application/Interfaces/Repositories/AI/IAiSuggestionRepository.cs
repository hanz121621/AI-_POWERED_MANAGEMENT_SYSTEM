using System;
using System.Threading.Tasks;
using AI_PMS.Domain.Entities.AI;


namespace AI_PMS.Application.Interfaces.Repositories.AI
{
    public interface IAiSuggestionRepository
    {
        Task AddAsync(AiSuggestion suggestion);
        Task SaveChangesAsync();
        Task<AiSettings> GetAiSettingsAsync();
        Task UpdateAiSettingsAsync(AiSettings settings);
        Task<AiUsageLog> LogAiUsageAsync(AiUsageLog usageLog);
Task<List<AiUsageLog>> GetAiUsageLogsAsync(DateTime? startDate = null, DateTime? endDate = null, string? featureType = null, Guid? projectId = null);
    }
}