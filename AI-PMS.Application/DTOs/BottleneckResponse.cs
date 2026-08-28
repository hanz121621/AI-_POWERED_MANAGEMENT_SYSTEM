namespace AI_PMS.Application.DTOs;

public class BottleneckResponse
{
    public List<BottleneckItem> Bottlenecks { get; set; } = new();

    public List<string> Recommendations { get; set; } = new();
}

public class BottleneckItem
{
    public string TaskTitle { get; set; } = string.Empty;

    public string Reason { get; set; } = string.Empty;

    public string Severity { get; set; } = string.Empty;

    public List<string> SuggestedActions { get; set; } = new();
}