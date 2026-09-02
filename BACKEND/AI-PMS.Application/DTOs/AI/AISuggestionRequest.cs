namespace AI_PMS.Application.DTOs.AI;

public class AISuggestionRequest
{
    public string Context { get; set; } =
        string.Empty;

    public Guid? ProjectId { get; set; }

    public Guid? TeamId { get; set; }

    public Guid? UserId { get; set; }
}