
using System.Text;
using System.Text.Json;
using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;

namespace AI_PMS.Infrastructure.AI.Services;

public class RecommendationService : IRecommendationService
{
    private readonly HttpClient _httpClient;
    private readonly IAISuggestionService _aiSuggestionService;

    public RecommendationService(
        HttpClient httpClient,
        IAISuggestionService aiSuggestionService)
    {
        _httpClient = httpClient;
        _aiSuggestionService = aiSuggestionService;

        // Local Ollama can be slow when running on CPU.
        _httpClient.Timeout = TimeSpan.FromMinutes(5);
    }

    public async Task<RecommendationResponse> GetRecommendationsAsync(
        RecommendationRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        var title = request.Title?.Trim() ?? string.Empty;
        var description = request.Description?.Trim() ?? string.Empty;
        var complexity = request.Complexity?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException(
                "Task title is required.",
                nameof(request));
        }

        if (request.EstimatedHours <= 0)
        {
            throw new ArgumentException(
                "Estimated hours must be greater than zero.",
                nameof(request));
        }

        // =====================================================
        // Build AI Prompt
        // =====================================================

        var prompt =
            "You are an expert software project manager working on an " +
            "ASP.NET Core and C# project.\n\n" +

            "Analyze the following software development task and provide " +
            "practical implementation recommendations.\n\n" +

            "TASK TITLE:\n" +
            title + "\n\n" +

            "DESCRIPTION:\n" +
            description + "\n\n" +

            "COMPLEXITY:\n" +
            complexity + "\n\n" +

            "ESTIMATED HOURS:\n" +
            request.EstimatedHours + "\n\n" +

            "IMPORTANT RULES:\n" +
            "1. Provide exactly 3 recommendations.\n" +
            "2. Provide exactly 3 suggested actions.\n" +
            "3. Recommendations must be practical.\n" +
            "4. Suggested actions must be specific and realistic.\n" +
            "5. Keep every item short and clear.\n" +
            "6. The backend technology is ASP.NET Core and C#.\n" +
            "7. Prefer real ASP.NET Core and .NET technologies when naming technologies.\n" +
            "8. Do not suggest Node.js, Express.js, Passport.js, or JavaScript backend libraries.\n" +
            "9. Do not invent class names, service names, files, namespaces, or methods.\n" +
            "10. Do not assume that a particular class already exists.\n" +
            "11. Recommendations should work with a Clean Architecture ASP.NET Core project.\n" +
            "12. Return ONLY valid JSON.\n" +
            "13. Do NOT return Markdown.\n" +
            "14. Do NOT use code fences.\n\n" +

            "Return exactly this JSON structure:\n" +

            "{\n" +
            "  \"recommendations\": [\n" +
            "    \"Recommendation 1\",\n" +
            "    \"Recommendation 2\",\n" +
            "    \"Recommendation 3\"\n" +
            "  ],\n" +
            "  \"suggestedActions\": [\n" +
            "    \"Action 1\",\n" +
            "    \"Action 2\",\n" +
            "    \"Action 3\"\n" +
            "  ]\n" +
            "}";

        // =====================================================
        // Ollama Request
        // =====================================================

        var ollamaRequest = new
        {
            model = "llama3.2:1b",
            prompt = prompt,
            stream = false,
            format = "json",
            options = new
            {
                num_ctx = 512,
                temperature = 0.1,
                num_predict = 300
            }
        };

        var requestJson =
            JsonSerializer.Serialize(ollamaRequest);

        using var httpContent =
            new StringContent(
                requestJson,
                Encoding.UTF8,
                "application/json");

        HttpResponseMessage response;

        // =====================================================
        // Send Request to Ollama
        // =====================================================

        try
        {
            response =
                await _httpClient.PostAsync(
                    "http://127.0.0.1:11434/api/generate",
                    httpContent);
        }
        catch (TaskCanceledException ex)
        {
            throw new InvalidOperationException(
                "Ollama request timed out. " +
                "Make sure Ollama is running and llama3.2:1b is available.",
                ex);
        }
        catch (HttpRequestException ex)
        {
            throw new InvalidOperationException(
                "Could not connect to Ollama at " +
                "http://127.0.0.1:11434.",
                ex);
        }

        // =====================================================
        // Check Ollama HTTP Response
        // =====================================================

        if (!response.IsSuccessStatusCode)
        {
            var error =
                await response.Content.ReadAsStringAsync();

            throw new InvalidOperationException(
                $"Ollama returned HTTP " +
                $"{(int)response.StatusCode}: {error}");
        }

        var responseBody =
            await response.Content.ReadAsStringAsync();

        if (string.IsNullOrWhiteSpace(responseBody))
        {
            throw new InvalidOperationException(
                "Ollama returned an empty response.");
        }

        // =====================================================
        // Parse Ollama Response
        // =====================================================

        OllamaResponse? ollamaResponse;

        try
        {
            ollamaResponse =
                JsonSerializer.Deserialize<OllamaResponse>(
                    responseBody,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException(
                "Could not parse Ollama HTTP response.",
                ex);
        }

        if (ollamaResponse == null ||
            string.IsNullOrWhiteSpace(
                ollamaResponse.Response))
        {
            throw new InvalidOperationException(
                "Ollama returned an empty AI response.");
        }

        // =====================================================
        // Clean AI JSON
        // =====================================================

        var aiJson =
            CleanJsonResponse(
                ollamaResponse.Response);

        if (string.IsNullOrWhiteSpace(aiJson))
        {
            throw new InvalidOperationException(
                "The AI returned empty recommendation JSON.");
        }

        // =====================================================
        // Deserialize Recommendation
        // =====================================================

        RecommendationResponse? result;

        try
        {
            result =
                JsonSerializer.Deserialize<RecommendationResponse>(
                    aiJson,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException(
                $"The AI returned invalid JSON. " +
                $"AI response: {aiJson}",
                ex);
        }

        if (result == null)
        {
            throw new InvalidOperationException(
                "The AI returned an empty recommendation response.");
        }

        // =====================================================
        // Ensure Lists Exist
        // =====================================================

        if (result.Recommendations == null)
        {
            result.Recommendations =
                new List<string>();
        }

        if (result.SuggestedActions == null)
        {
            result.SuggestedActions =
                new List<string>();
        }

        // =====================================================
        // Validate AI Result
        // =====================================================

        if (result.Recommendations.Count == 0)
        {
            throw new InvalidOperationException(
                "The AI did not return any recommendations.");
        }

        if (result.SuggestedActions.Count == 0)
        {
            throw new InvalidOperationException(
                "The AI did not return any suggested actions.");
        }

        // =====================================================
        // Save AI Recommendation as AISuggestion
        // =====================================================

        var suggestionDescription =
            $"Recommendations: " +
            $"{string.Join(" ", result.Recommendations)} " +

            $"Suggested Actions: " +
            $"{string.Join(" ", result.SuggestedActions)}";

        var suggestion =
            new AISuggestionDto
            {
                ProjectId = null,

                Type = "Recommendation",

                Title =
                    $"AI Recommendation: {title}",

                Description =
                    suggestionDescription,

                Priority =
                    string.IsNullOrWhiteSpace(complexity)
                        ? "Medium"
                        : complexity,

                IsRead = false
            };

        await _aiSuggestionService.CreateAsync(
            suggestion);

        // =====================================================
        // Return Result
        // =====================================================

        return result;
    }

    // =========================================================
    // Clean AI Response
    // =========================================================

    private static string CleanJsonResponse(
        string response)
    {
        if (string.IsNullOrWhiteSpace(response))
        {
            return string.Empty;
        }

        response =
            response.Trim();

        // Remove Markdown code fences
        if (response.StartsWith("```"))
        {
            response =
                response
                    .Replace("```json", string.Empty)
                    .Replace("```JSON", string.Empty)
                    .Replace("```", string.Empty)
                    .Trim();
        }

        // Find first JSON object
        var firstBrace =
            response.IndexOf('{');

        // Find last JSON object brace
        var lastBrace =
            response.LastIndexOf('}');

        if (firstBrace >= 0 &&
            lastBrace > firstBrace)
        {
            response =
                response[
                    firstBrace..
                    (lastBrace + 1)];
        }

        return response.Trim();
    }

    // =========================================================
    // Ollama Response Model
    // =========================================================

    private sealed class OllamaResponse
    {
        public string Response { get; set; } =
            string.Empty;
    }
}

