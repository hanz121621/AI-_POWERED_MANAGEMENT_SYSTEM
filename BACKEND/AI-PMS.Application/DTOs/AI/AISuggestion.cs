namespace AI_PMS.Application.DTOs.AI;

public class AISuggestion
{
    public Guid Id { get; set; } =
        Guid.NewGuid();

    public string Title { get; set; } =
        string.Empty;

    public string Description { get; set; } =
        string.Empty;

    public string Type { get; set; } =
        "Recommendation";

    public string Priority { get; set; } =
        "Medium";

    public string Status { get; set; } =
        "Available";

    public Guid? ProjectId { get; set; }

    public Guid? TeamId { get; set; }

    public Guid? UserId { get; set; }

    public string? Reason { get; set; }

    public decimal? Confidence { get; set; }

    public DateTime CreatedAt { get; set; } =
        DateTime.UtcNow;
}