namespace AI_PMS.Application.DTOs;

public class RecommendationRequest
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Complexity { get; set; } = string.Empty;

    public int EstimatedHours { get; set; }
}