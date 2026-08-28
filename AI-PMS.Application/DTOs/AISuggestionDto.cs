namespace AI_PMS.Application.DTOs;

public class AISuggestionDto
{
    public Guid Id { get; set; }

    public Guid? ProjectId { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Priority { get; set; } = "Medium";

    public bool IsRead { get; set; }

    public DateTime CreatedAt { get; set; }
}