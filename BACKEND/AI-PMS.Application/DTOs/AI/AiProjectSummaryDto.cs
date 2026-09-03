using System;
using System.Collections.Generic;

namespace AI_PMS.Application.DTOs.AI
{
    public class AiProjectSummaryDto
    {
        public Guid ProjectId { get; set; }
        public string OverallProgress { get; set; } = string.Empty;
        public List<string> KeyRisks { get; set; } = new List<string>();
        public string RecentActivities { get; set; } = string.Empty;
        public List<string> NextSteps { get; set; } = new List<string>();
    }
}