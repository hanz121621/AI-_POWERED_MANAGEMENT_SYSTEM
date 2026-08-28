namespace AI_PMS.Application.DTOs;

public class TaskAnalysisResult
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public TaskSize TaskSize { get; set; }

    public string Reason { get; set; } = string.Empty;
}