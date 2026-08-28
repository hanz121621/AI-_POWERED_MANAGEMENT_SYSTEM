using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;

namespace AI_PMS.Infrastructure.AI.Services;

public class RiskPredictionService : IRiskPredictionService
{
    private readonly IAISuggestionService _aiSuggestionService;

    public RiskPredictionService(
        IAISuggestionService aiSuggestionService)
    {
        _aiSuggestionService = aiSuggestionService;
    }

    public async Task<RiskPredictionResponse> PredictRiskAsync(
        RiskPredictionRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var title = request.Title?.Trim() ?? string.Empty;
        var description = request.Description?.Trim() ?? string.Empty;
        var complexity = request.Complexity?.Trim() ?? string.Empty;
        var estimatedHours = request.EstimatedHours;

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException(
                "Task title is required.",
                nameof(request));
        }

        if (estimatedHours <= 0)
        {
            throw new ArgumentException(
                "Estimated hours must be greater than zero.",
                nameof(request));
        }

        // =====================================================
        // Calculate Risk
        // =====================================================

        var riskScore = 20;

        var risks = new List<string>();

        var recommendations = new List<string>();

        // =====================================================
        // Complexity Analysis
        // =====================================================

        if (complexity.Equals(
                "High",
                StringComparison.OrdinalIgnoreCase))
        {
            riskScore += 30;

            risks.Add(
                "The task has high implementation complexity.");

            recommendations.Add(
                "Break the task into smaller implementation steps.");
        }
        else if (complexity.Equals(
                     "Medium",
                     StringComparison.OrdinalIgnoreCase))
        {
            riskScore += 15;

            risks.Add(
                "The task has moderate implementation complexity.");

            recommendations.Add(
                "Review the technical requirements before implementation.");
        }
        else
        {
            risks.Add(
                "The task has relatively low complexity.");
        }

        // =====================================================
        // Estimated Hours Analysis
        // =====================================================

        if (estimatedHours >= 40)
        {
            riskScore += 30;

            risks.Add(
                "The estimated workload is large and may create schedule risk.");

            recommendations.Add(
                "Consider dividing the task into smaller tasks or subtasks.");
        }
        else if (estimatedHours >= 20)
        {
            riskScore += 20;

            risks.Add(
                "The task has a significant estimated workload.");

            recommendations.Add(
                "Monitor progress regularly to avoid schedule delays.");
        }
        else if (estimatedHours >= 8)
        {
            riskScore += 10;

            risks.Add(
                "The task may require multiple development sessions.");
        }

        // =====================================================
        // Description Analysis
        // =====================================================

        var descriptionLength = description.Length;

        if (descriptionLength < 30)
        {
            riskScore += 15;

            risks.Add(
                "The task description contains limited implementation details.");

            recommendations.Add(
                "Clarify the requirements before development begins.");
        }

        // =====================================================
        // Technical Keyword Analysis
        // =====================================================

        var lowerText =
            $"{title} {description}".ToLowerInvariant();

        if (lowerText.Contains("authentication") ||
            lowerText.Contains("authorization") ||
            lowerText.Contains("security") ||
            lowerText.Contains("payment") ||
            lowerText.Contains("database") ||
            lowerText.Contains("integration") ||
            lowerText.Contains("api"))
        {
            riskScore += 10;

            risks.Add(
                "The task involves technical components that may require additional testing.");

            recommendations.Add(
                "Perform additional integration and security testing.");
        }

        // =====================================================
        // Limit Score
        // =====================================================

        if (riskScore > 100)
        {
            riskScore = 100;
        }

        // =====================================================
        // Determine Risk Level
        // =====================================================

        string riskLevel;

        if (riskScore >= 70)
        {
            riskLevel = "High";
        }
        else if (riskScore >= 40)
        {
            riskLevel = "Medium";
        }
        else
        {
            riskLevel = "Low";
        }

        // =====================================================
        // Default Recommendation
        // =====================================================

        if (recommendations.Count == 0)
        {
            recommendations.Add(
                "Continue monitoring the task during implementation.");
        }

        // =====================================================
        // Create Risk Prediction Response
        // =====================================================

        var result = new RiskPredictionResponse
        {
            RiskLevel = riskLevel,
            RiskScore = riskScore,
            Risks = risks,
            Recommendations = recommendations
        };

        // =====================================================
        // Save AI Result as AI Suggestion
        // =====================================================

        var suggestionDescription =
            $"Risk Level: {riskLevel}. " +
            $"Risk Score: {riskScore}/100. " +
            $"Risks: {string.Join(" ", risks)} " +
            $"Recommendations: {string.Join(" ", recommendations)}";

        var suggestion = new AISuggestionDto
        {
            ProjectId = null,

            Type = "RiskPrediction",

            Title = $"Risk Prediction: {title}",

            Description = suggestionDescription,

            Priority = riskLevel,

            IsRead = false
        };

        await _aiSuggestionService.CreateAsync(
            suggestion);

        // =====================================================
        // Return Result to API
        // =====================================================

        return result;
    }
}