namespace AI_PMS.Application.DTOs;

public class TaskAnalysisResponse
{
    public TaskSize Size { get; set; }

    public string Reason { get; set; } = string.Empty;

    public List<SubtaskDto> Subtasks { get; set; } = new();
}