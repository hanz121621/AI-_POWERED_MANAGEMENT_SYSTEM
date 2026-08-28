namespace AI_PMS.Application.DTOs;

public class DeadlinePredictionResponse
{
    public string ProjectName { get; set; } = string.Empty;

    public DateTime? OfficialDeadline { get; set; }

    public DateTime? PredictedCompletionDate { get; set; }

    public int DaysDifference { get; set; }

    public string DelayStatus { get; set; } = string.Empty;

    public string RiskLevel { get; set; } = string.Empty;

    public double CurrentProgressPercentage { get; set; }

    public string OverallAnalysis { get; set; } = string.Empty;

    public List<string> KeyFactors { get; set; } = new();

    public List<string> Recommendations { get; set; } = new();
}