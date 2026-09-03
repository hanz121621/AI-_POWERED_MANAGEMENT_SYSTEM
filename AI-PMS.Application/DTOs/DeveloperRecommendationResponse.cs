namespace AI_PMS.Application.DTOs;

public class DeveloperRecommendationResponse
{
    public Guid DeveloperId { get; set; }

    public int TaskCount { get; set; }

    public List<string> Recommendations { get; set; } = new();

    public List<string> SuggestedActions { get; set; } = new();
}