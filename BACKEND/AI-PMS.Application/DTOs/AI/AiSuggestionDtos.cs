using System;

namespace AI_PMS.Application.DTOs.AI
{
    // Request DTO: What the frontend sends to generate a suggestion
    public class GenerateAiSuggestionRequestDto
    {
        public Guid ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public string ProjectDescription { get; set; } = string.Empty;
        public string CurrentStatus { get; set; } = string.Empty;
        public int ActiveTasks { get; set; }
        public string Deadline { get; set; } = string.Empty;
    }

    // Response DTO: What the backend returns to the frontend
    public class AiSuggestionResponseDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ProjectId { get; set; }
        public string SuggestionType { get; set; } = "General"; // e.g., "Risk", "Optimization", "Timeline"
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = "Medium"; // High, Medium, Low
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    }
}