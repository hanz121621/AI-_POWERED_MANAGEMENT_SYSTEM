using System;
using System.Collections.Generic;

namespace AI_PMS.Application.DTOs.AI
{
    public class AiRiskPredictionDto
    {
        public Guid ProjectId { get; set; }
        public string RiskLevel { get; set; } = "Unknown"; // Low, Medium, High
        public int RiskScore { get; set; } // 0 to 100
        public string Summary { get; set; } = string.Empty;
        public List<string> SupportingFactors { get; set; } = new List<string>();
    }
}