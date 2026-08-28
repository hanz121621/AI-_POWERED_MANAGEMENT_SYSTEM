namespace AI_PMS.Application.DTOs;

public class BottleneckRequest
{
    public string ProjectName { get; set; } = string.Empty;

    public List<BottleneckTaskDto> Tasks { get; set; } = new();
}

public class BottleneckTaskDto
{
    public string Title { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public string Complexity { get; set; } = string.Empty;

    public int EstimatedHours { get; set; }

    public string AssignedTo { get; set; } = string.Empty;
}