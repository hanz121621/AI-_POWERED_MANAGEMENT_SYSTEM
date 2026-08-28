namespace AI_PMS.Application.DTOs;

public class ProjectProgressResponse
{
    public string ProjectName { get; set; } = string.Empty;

    public double CurrentProgressPercentage { get; set; }

    public double PredictedProgressPercentage { get; set; }

    public string ProgressStatus { get; set; } = string.Empty;

    public string OverallAnalysis { get; set; } = string.Empty;

    public List<string> KeyFindings { get; set; } = new();

    public List<string> Recommendations { get; set; } = new();
}