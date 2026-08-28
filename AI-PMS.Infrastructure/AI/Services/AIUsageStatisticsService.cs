using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using AI_PMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.AI.Services;

public class AIUsageStatisticsService : IAIUsageStatisticsService
{
    private readonly ApplicationDbContext _context;

    public AIUsageStatisticsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AIUsageStatisticsResponse> GetStatisticsAsync(
        CancellationToken cancellationToken = default)
    {
        var suggestions = await _context.AISuggestions
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var total = suggestions.Count;

        var unread = suggestions.Count(x => !x.IsRead);

        var read = suggestions.Count(x => x.IsRead);

        var taskDecomposition = suggestions.Count(x =>
            x.Type.Equals(
                "TaskDecomposition",
                StringComparison.OrdinalIgnoreCase));

        var riskPrediction = suggestions.Count(x =>
            x.Type.Equals(
                "RiskPrediction",
                StringComparison.OrdinalIgnoreCase));

        var recommendation = suggestions.Count(x =>
            x.Type.Equals(
                "Recommendation",
                StringComparison.OrdinalIgnoreCase));

        var bottleneckDetection = suggestions.Count(x =>
            x.Type.Equals(
                "BottleneckDetection",
                StringComparison.OrdinalIgnoreCase));

        var suggestionsByType = suggestions
            .GroupBy(x => string.IsNullOrWhiteSpace(x.Type)
                ? "Unknown"
                : x.Type)
            .ToDictionary(
                group => group.Key,
                group => group.Count());

        var suggestionsByPriority = suggestions
            .GroupBy(x => string.IsNullOrWhiteSpace(x.Priority)
                ? "Unknown"
                : x.Priority)
            .ToDictionary(
                group => group.Key,
                group => group.Count());

        var lastSuggestion = suggestions
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefault();

        return new AIUsageStatisticsResponse
        {
            TotalSuggestions = total,

            UnreadSuggestions = unread,

            ReadSuggestions = read,

            TaskDecompositionCount = taskDecomposition,

            RiskPredictionCount = riskPrediction,

            RecommendationCount = recommendation,

            BottleneckDetectionCount = bottleneckDetection,

            SuggestionsByType = suggestionsByType,

            SuggestionsByPriority = suggestionsByPriority,

            LastSuggestionCreatedAt =
                lastSuggestion?.CreatedAt
        };
    }
}