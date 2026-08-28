namespace AI_PMS.Application.DTOs;

public class TaskDecompositionResponse
{
    public List<SubtaskDto> Subtasks { get; set; } = new();
}

public class SubtaskDto
{
    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Complexity { get; set; } = string.Empty;

    public double EstimatedHours { get; set; }

    public List<string> Dependencies { get; set; } = new();
}