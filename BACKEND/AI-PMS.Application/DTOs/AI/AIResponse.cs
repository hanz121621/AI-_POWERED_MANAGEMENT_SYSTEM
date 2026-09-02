namespace AI_PMS.Application.DTOs.AI;

public class AIResponse
{
    public string Content { get; set; } = string.Empty;

    public bool Success { get; set; }

    public string? ErrorMessage { get; set; }
}