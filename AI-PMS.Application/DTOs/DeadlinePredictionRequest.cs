namespace AI_PMS.Application.DTOs;

public class DeadlinePredictionRequest
{
    public string ProjectName { get; set; } = string.Empty;

    public DateTime? ProjectDeadline { get; set; }

    public int TotalTasks { get; set; }

    public int CompletedTasks { get; set; }

    public int RemainingTasks { get; set; }

    public int InProgressTasks { get; set; }

    public int BlockedTasks { get; set; }

    public int OverdueTasks { get; set; }

    public int TotalEstimatedHours { get; set; }

    public int TotalActualHours { get; set; }

    public double CompletionRate { get; set; }
}