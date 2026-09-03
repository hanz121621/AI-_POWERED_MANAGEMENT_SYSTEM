namespace AI_PMS.Application.DTOs;

public class StaffAIResponse
{
    public TaskSize TaskSize { get; set; }

    public string TaskSizeReason { get; set; } = string.Empty;

    public List<SubtaskDto> Subtasks { get; set; } = new();

    public List<string> Recommendations { get; set; } = new();

    public List<string> SuggestedActions { get; set; } = new();

    public string RiskLevel { get; set; } = string.Empty;

    public int RiskScore { get; set; }

    public List<string> Risks { get; set; } = new();
}