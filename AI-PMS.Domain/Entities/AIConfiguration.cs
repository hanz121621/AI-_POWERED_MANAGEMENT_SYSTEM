namespace AI_PMS.Domain.Entities;

public class AIConfiguration
{
    public Guid Id { get; set; }

    public bool IsAIEnabled { get; set; }

    public bool EnableRecommendations { get; set; }

    public bool EnableRiskPrediction { get; set; }

    public int AnalysisFrequencyMinutes { get; set; }

    public bool EnableNotifications { get; set; }

    public string Model { get; set; } = "llama3.2:1b";
}