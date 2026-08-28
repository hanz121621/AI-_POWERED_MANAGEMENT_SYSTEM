namespace AI_PMS.Application.DTOs;

public class ProjectProgressRequest
{
    public string ProjectName { get; set; } = string.Empty;

    public int TotalTasks { get; set; }

    public int CompletedTasks { get; set; }

    public int InProgressTasks { get; set; }

    public int BlockedTasks { get; set; }

    public int RemainingTasks { get; set; }

    public double CompletionRate { get; set; }

    public int TotalSprints { get; set; }

    public int CompletedSprints { get; set; }

    public int ActiveSprints { get; set; }

    public int TotalEstimatedHours { get; set; }

    public int TotalActualHours { get; set; }
}