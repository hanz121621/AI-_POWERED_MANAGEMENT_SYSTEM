namespace AI_PMS.Application.DTOs;

public class AIUsageStatisticsResponse
{
    public int TotalSuggestions { get; set; }

    public int UnreadSuggestions { get; set; }

    public int ReadSuggestions { get; set; }

    public int TaskDecompositionCount { get; set; }

    public int RiskPredictionCount { get; set; }

    public int RecommendationCount { get; set; }

    public int BottleneckDetectionCount { get; set; }

    public Dictionary<string, int> SuggestionsByType { get; set; } = new();

    public Dictionary<string, int> SuggestionsByPriority { get; set; } = new();

    public DateTime? LastSuggestionCreatedAt { get; set; }
}