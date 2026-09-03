using AI_PMS.Application.DTOs;
namespace AI_PMS.Application.DTOs;
public class TeamLeaderAIResponse
{
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public TeamPerformanceResponse TeamPerformance { get; set; }
        = new();
    public ProjectProgressResponse ProjectProgress { get; set; }
        = new();
    public BottleneckResponse Bottlenecks { get; set; }
        = new();
    public DeadlinePredictionResponse DeadlinePrediction { get; set; }
        = new();
    public string OverallStatus { get; set; } = string.Empty;
    public string OverallAnalysis { get; set; } = string.Empty;
    public List<string> KeyFindings { get; set; } = new();
    public List<string> Recommendations { get; set; } = new();
    public List<string> SuggestedActions { get; set; } = new();
}
