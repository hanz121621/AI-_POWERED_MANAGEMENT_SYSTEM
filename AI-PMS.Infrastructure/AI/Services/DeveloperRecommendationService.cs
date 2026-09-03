using System.Text;
using System.Text.Json;
using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using AI_PMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.AI.Services;

public class DeveloperRecommendationService
    : IDeveloperRecommendationService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly HttpClient _httpClient;
    private readonly IAISuggestionService _aiSuggestionService;

    public DeveloperRecommendationService(
        ApplicationDbContext dbContext,
        HttpClient httpClient,
        IAISuggestionService aiSuggestionService)
    {
        _dbContext = dbContext;
        _httpClient = httpClient;
        _aiSuggestionService = aiSuggestionService;

        _httpClient.Timeout = TimeSpan.FromMinutes(5);
    }

    public async Task<DeveloperRecommendationResponse>
        GetRecommendationsAsync(
            DeveloperRecommendationRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (request.DeveloperId == Guid.Empty)
        {
            throw new ArgumentException(
                "DeveloperId is required.",
                nameof(request));
        }

        // =====================================================
        // Find developer
        // =====================================================

        var developer = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(
                u => u.Id == request.DeveloperId);

        if (developer == null)
        {
            throw new InvalidOperationException(
                "Developer was not found.");
        }

        // =====================================================
        // Get assigned tasks
        // =====================================================

        var tasks = await _dbContext.Tasks
            .AsNoTracking()
            .Include(t => t.Sprint)
            .Where(t =>
                t.AssignedUserId == request.DeveloperId)
            .OrderBy(t => t.DueDate)
            .ToListAsync();

        if (tasks.Count == 0)
        {
            return new DeveloperRecommendationResponse
            {
                DeveloperId = request.DeveloperId,
                TaskCount = 0,
                Recommendations = new List<string>
                {
                    "No tasks are currently assigned to this developer."
                },
                SuggestedActions = new List<string>
                {
                    "Ask the Team Leader for a task assignment."
                }
            };
        }

        // =====================================================
        // Build task information
        // =====================================================

        var taskInformation = new StringBuilder();

        foreach (var task in tasks)
        {
            taskInformation.AppendLine(
                $"TASK: {task.Title}");

            taskInformation.AppendLine(
                $"DESCRIPTION: {task.Description ?? "No description"}");

            taskInformation.AppendLine(
                $"STATUS: {task.Status}");

            taskInformation.AppendLine(
                $"PRIORITY: {task.Priority}");

            taskInformation.AppendLine(
                $"DUE DATE: " +
                $"{(task.DueDate.HasValue ? task.DueDate.Value.ToString("yyyy-MM-dd") : "No due date")}");

            taskInformation.AppendLine(
                $"ESTIMATED HOURS: " +
                $"{(task.EstimatedHours.HasValue ? task.EstimatedHours.Value.ToString() : "Not estimated")}");

            taskInformation.AppendLine(
                $"ACTUAL HOURS: " +
                $"{(task.ActualHours.HasValue ? task.ActualHours.Value.ToString() : "Not recorded")}");

            taskInformation.AppendLine(
                $"SPRINT: " +
                $"{(task.Sprint != null ? task.Sprint.Name : "No sprint")}");

            taskInformation.AppendLine();
        }

        // =====================================================
        // Build AI prompt
        // =====================================================

        var developerName =
            $"{developer.FirstName} {developer.LastName}".Trim();

        var prompt =
            "You are an AI assistant for a software project management system.\n\n" +

            "Your task is to analyze a developer's currently assigned tasks " +
            "and recommend what the developer should focus on.\n\n" +

            $"DEVELOPER:\n{developerName}\n\n" +

            "ASSIGNED TASKS:\n" +
            taskInformation +

            "\nIMPORTANT RULES:\n" +
            "1. Provide exactly 3 recommendations.\n" +
            "2. Provide exactly 3 suggested actions.\n" +
            "3. Prioritize urgent and high-priority tasks.\n" +
            "4. Consider task status and due dates.\n" +
            "5. Consider estimated versus actual hours when available.\n" +
            "6. Consider blocked or unfinished work.\n" +
            "7. Recommendations must be practical for a software developer.\n" +
            "8. Do not invent tasks that are not listed.\n" +
            "9. Do not invent deadlines.\n" +
            "10. Keep each recommendation short and clear.\n" +
            "11. Return ONLY valid JSON.\n" +
            "12. Do NOT return Markdown.\n" +
            "13. Do NOT use code fences.\n\n" +

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
        // Ollama request
        // =====================================================

        var ollamaRequest = new
        {
            model = "llama3.2:1b",
            prompt = prompt,
            stream = false,
            format = "json",
            options = new
            {
                num_ctx = 2048,
                temperature = 0.1,
                num_predict = 400
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

        try
        {
            response = await _httpClient.PostAsync(
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
        // Parse Ollama response
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
        // Clean JSON
        // =====================================================

        var aiJson =
            CleanJsonResponse(
                ollamaResponse.Response);

        // =====================================================
        // Deserialize result
        // =====================================================

        DeveloperRecommendationResponse? result;

        try
        {
            result =
                JsonSerializer.Deserialize
                    <DeveloperRecommendationResponse>(
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

        result.DeveloperId =
            request.DeveloperId;

        result.TaskCount =
            tasks.Count;

        result.Recommendations ??=
            new List<string>();

        result.SuggestedActions ??=
            new List<string>();

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
        // Save AI suggestion
        // =====================================================

        var suggestionDescription =
            $"Developer: {developerName}. " +
            $"Assigned tasks: {tasks.Count}. " +
            $"Recommendations: " +
            $"{string.Join(" ", result.Recommendations)} " +
            $"Suggested actions: " +
            $"{string.Join(" ", result.SuggestedActions)}";

        var suggestion =
            new AISuggestionDto
            {
                ProjectId =
                    tasks.FirstOrDefault()?.ProjectId,

                Type =
                    "Developer Work Recommendation",

                Title =
                    $"AI Work Recommendation for {developerName}",

                Description =
                    suggestionDescription,

                Priority =
                    tasks.Any(t =>
                        t.Priority.ToString()
                            .Equals(
                                "High",
                                StringComparison.OrdinalIgnoreCase))
                        ? "High"
                        : "Medium",

                IsRead = false
            };

        await _aiSuggestionService.CreateAsync(
            suggestion);

        return result;
    }

    // =========================================================
    // Clean AI JSON
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

        if (response.StartsWith("```"))
        {
            response =
                response
                    .Replace("```json", string.Empty)
                    .Replace("```JSON", string.Empty)
                    .Replace("```", string.Empty)
                    .Trim();
        }

        var firstBrace =
            response.IndexOf('{');

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
    // Ollama response
    // =========================================================

    private sealed class OllamaResponse
    {
        public string Response { get; set; } =
            string.Empty;
    }
}