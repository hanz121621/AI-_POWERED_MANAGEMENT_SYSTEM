namespace AI_PMS.Application.DTOs;

public class RiskPredictionResponse
{
    public string RiskLevel { get; set; } = string.Empty;

    public int RiskScore { get; set; }

    public List<string> Risks { get; set; } = new();

    public List<string> Recommendations { get; set; } = new();
}