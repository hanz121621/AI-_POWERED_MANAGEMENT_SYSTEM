using System;
using System.Collections.Generic;

namespace AI_PMS.Application.DTOs.AI
{
    public class ProjectAiContextDto
    {
        public Guid ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public string CurrentStatus { get; set; } = string.Empty;
        public string Deadline { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // Sprint Metrics
        public int TotalSprints { get; set; }
        public int ActiveSprints { get; set; }
        public string ActiveSprintName { get; set; } = "None";

        // Task Metrics
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }
        public int BlockedTasks { get; set; }
        public int OverdueTasks { get; set; }
        public int ProgressPercentage { get; set; }

        // Team Metrics
        public int TotalTeamMembers { get; set; }
        public string RecentIssues { get; set; } = "No recent issues reported.";
    }
}