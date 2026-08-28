namespace AI_PMS.Application.DTOs;

public class RecommendationResponse
{
    public List<string> Recommendations { get; set; } = new();

    public List<string> SuggestedActions { get; set; } = new();
}