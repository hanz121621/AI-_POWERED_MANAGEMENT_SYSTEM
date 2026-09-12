using System.Net.Http.Json;
using System.Text.Json;

using AI_PMS.Application.DTOs.AI;
using AI_PMS.Application.Interfaces.AI;
using AI_PMS.Infrastructure.AI.Configuration;

using Microsoft.Extensions.Options;

namespace AI_PMS.Infrastructure.AI.Services;

public class OllamaService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly AIOptions _options;

    public OllamaService(
        HttpClient httpClient,
        IOptions<AIOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;

        _httpClient.BaseAddress =
            new Uri(_options.OllamaUrl);

        _httpClient.Timeout =
            TimeSpan.FromMinutes(10);
    }

    // ============================================================
    // EXISTING GENERAL AI RESPONSE
    // ============================================================

    public async Task<AIResponse> GenerateResponseAsync(
        AIRequest request)
    {
        try
        {
            var payload = new
            {
                model = _options.Model,
                prompt = request.Prompt,
                stream = false
            };

            using var response =
                await _httpClient.PostAsJsonAsync(
                    "/api/generate",
                    payload);

            response.EnsureSuccessStatusCode();

            var result =
                await response.Content
                    .ReadFromJsonAsync<OllamaResponse>();

            if (result == null ||
                string.IsNullOrWhiteSpace(result.Response))
            {
                return new AIResponse
                {
                    Content = string.Empty,
                    Success = false,
                    ErrorMessage =
                        "Ollama returned an empty response."
                };
            }

            return new AIResponse
            {
                Content = result.Response,
                Success = true
            };
        }
        catch (TaskCanceledException)
        {
            return new AIResponse
            {
                Content = string.Empty,
                Success = false,
                ErrorMessage =
                    "Ollama request timed out."
            };
        }
        catch (HttpRequestException ex)
        {
            return new AIResponse
            {
                Content = string.Empty,
                Success = false,
                ErrorMessage =
                    "Could not connect to Ollama: " +
                    ex.Message
            };
        }
        catch (Exception ex)
        {
            return new AIResponse
            {
                Content = string.Empty,
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    // ============================================================
    // AI SUGGESTIONS
    // ============================================================
public async Task<List<AISuggestion>>
    GenerateSuggestionsAsync(
        AISuggestionRequest request)
{
    try
    {
        var prompt =
            "You are an AI assistant for a project management system.\n\n" +
            "Analyze the following project context and generate useful " +
            "project management suggestions.\n\n" +
            "PROJECT CONTEXT:\n" +
            request.Context +
            "\n\n" +

            "IMPORTANT OUTPUT RULE:\n" +
            "Return ONLY a JSON array.\n" +
            "Do not write any text before or after the JSON array.\n" +
            "Do not use markdown.\n" +
            "Do not use ```json.\n\n" +

            "The JSON array must contain between 3 and 5 objects.\n\n" +

            "Each object must contain exactly these fields:\n" +
            "title, description, type, priority, reason, confidence.\n\n" +

            "Allowed type values:\n" +
            "Recommendation, Warning, Prediction, Insight.\n\n" +

            "Allowed priority values:\n" +
            "Low, Medium, High, Critical.\n\n" +

            "confidence must be a number between 0 and 1.\n\n" +

            "Example output:\n" +
            "[{\"title\":\"Review delayed tasks\"," +
            "\"description\":\"Several tasks appear to be behind schedule.\"," +
            "\"type\":\"Warning\"," +
            "\"priority\":\"High\"," +
            "\"reason\":\"Multiple tasks are overdue and the project deadline is approaching.\"," +
            "\"confidence\":0.85}]";

        var payload = new
        {
            model = _options.Model,
            prompt,
            stream = false,
            format = "json"
        };

        using var response =
            await _httpClient.PostAsJsonAsync(
                "/api/generate",
                payload);

        response.EnsureSuccessStatusCode();

        var result =
            await response.Content
                .ReadFromJsonAsync<OllamaResponse>();

        if (result == null ||
            string.IsNullOrWhiteSpace(result.Response))
        {
            Console.WriteLine("Ollama returned an empty suggestion response.");

            return new List<AISuggestion>();
        }

        Console.WriteLine("========== OLLAMA SUGGESTION RESPONSE ==========");
        Console.WriteLine(result.Response);
        Console.WriteLine("=================================================");

        var json = result.Response.Trim();

        // ------------------------------------------------------------
        // Remove markdown code fences if Ollama happens to return them
        // ------------------------------------------------------------

        if (json.StartsWith("```"))
        {
            var firstNewLine = json.IndexOf('\n');

            if (firstNewLine >= 0)
            {
                json = json[(firstNewLine + 1)..];
            }

            var closingFence = json.LastIndexOf("```");

            if (closingFence >= 0)
            {
                json = json[..closingFence];
            }

            json = json.Trim();
        }

        // ------------------------------------------------------------
        // Find the JSON array if the model added extra text
        // ------------------------------------------------------------

        var arrayStart = json.IndexOf('[');
        var arrayEnd = json.LastIndexOf(']');

        if (arrayStart >= 0 &&
            arrayEnd > arrayStart)
        {
            json = json.Substring(
                arrayStart,
                arrayEnd - arrayStart + 1);
        }

        Console.WriteLine("========== EXTRACTED JSON ==========");
        Console.WriteLine(json);
        Console.WriteLine("====================================");

        var options =
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

        var cleanedResponse = result.Response.Trim();

List<AISuggestion>? suggestions = null;

try
{
    if (cleanedResponse.StartsWith("["))
    {
        suggestions =
            JsonSerializer.Deserialize<List<AISuggestion>>(
                cleanedResponse,
                options
            );
    }
    else if (cleanedResponse.StartsWith("{"))
    {
        var singleSuggestion =
            JsonSerializer.Deserialize<AISuggestion>(
                cleanedResponse,
                options
            );

        if (singleSuggestion != null)
        {
            suggestions = new List<AISuggestion>
            {
                singleSuggestion
            };
        }
    }
}
catch (JsonException ex)
{
    Console.WriteLine(
        $"Ollama JSON parsing error: {ex.Message}"
    );

    Console.WriteLine(
        $"Ollama response: {result.Response}"
    );
}

if (suggestions == null)
{
    Console.WriteLine(
        "Ollama did not return valid JSON."
    );

    return new List<AISuggestion>();
}

        if (suggestions == null ||
            suggestions.Count == 0)
        {
            Console.WriteLine(
                "Ollama returned no valid AI suggestions.");

            return new List<AISuggestion>();
        }

        // ------------------------------------------------------------
        // Attach system information
        // ------------------------------------------------------------

        foreach (var suggestion in suggestions)
        {
            suggestion.Id = Guid.NewGuid();

            suggestion.ProjectId =
                request.ProjectId;

            suggestion.TeamId =
                request.TeamId;

            suggestion.UserId =
                request.UserId;

            suggestion.Status = "Available";

            suggestion.CreatedAt =
                DateTime.UtcNow;
        }

        Console.WriteLine(
            $"Successfully parsed {suggestions.Count} AI suggestions.");

        return suggestions;
    }
    catch (JsonException ex)
    {
        Console.WriteLine(
            $"AI suggestion JSON parsing error: {ex.Message}");

        return new List<AISuggestion>();
    }
    catch (TaskCanceledException)
    {
        Console.WriteLine(
            "AI suggestion request timed out.");

        return new List<AISuggestion>();
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine(
            $"Could not connect to Ollama: {ex.Message}");

        return new List<AISuggestion>();
    }
    catch (Exception ex)
    {
        Console.WriteLine(
            $"AI suggestion generation error: {ex}");

        return new List<AISuggestion>();
    }
}
    // ============================================================
    // AI TASK BREAKDOWN (AI-TASK-001)
    // ============================================================

    public async Task<TaskBreakdownResponse> GenerateTaskBreakdownAsync(
        string sprintGoal, 
        string sprintDescription, 
        CancellationToken cancellationToken = default)
    {
        try
        {
            var prompt = 
                "You are an expert Agile project management AI assistant.\n\n" +
                "Analyze the following sprint information and break it down into specific, actionable tasks.\n\n" +
                $"SPRINT GOAL: {sprintGoal}\n" +
                $"SPRINT DESCRIPTION: {sprintDescription}\n\n" +
                "IMPORTANT OUTPUT RULE:\n" +
                "Return ONLY a valid JSON object containing a 'tasks' array.\n" +
                "Do not write any text before or after the JSON.\n" +
                "Do not use markdown formatting like ```json.\n\n" +
                "Generate 3 to 7 specific tasks. Each task object MUST contain exactly these fields:\n" +
                "- title (string): A clear, concise task title\n" +
                "- description (string): A detailed description of what needs to be done\n" +
                "- estimatedHours (integer): A realistic estimate of effort in hours\n" +
                "- recommendedRole (string): e.g., 'Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'QA/Tester', 'DevOps', 'Team Leader', or 'Staff'\n\n" +
                "Example output:\n" +
                "{\"tasks\": [{\"title\": \"Setup Database\", \"description\": \"Create initial schema\", \"estimatedHours\": 4, \"recommendedRole\": \"Backend Developer\"}]}";

            var payload = new
            {
                model = _options.Model,
                prompt = prompt,
                stream = false,
                format = "json" // Forces Ollama to return valid JSON
            };

            using var response = await _httpClient.PostAsJsonAsync(
                "/api/generate", 
                payload, 
                cancellationToken);

            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<OllamaResponse>(cancellationToken: cancellationToken);

            if (result == null || string.IsNullOrWhiteSpace(result.Response))
            {
                Console.WriteLine("Ollama returned an empty task breakdown response.");
                return new TaskBreakdownResponse();
            }

            Console.WriteLine("========== OLLAMA TASK BREAKDOWN RESPONSE ==========");
            Console.WriteLine(result.Response);
            Console.WriteLine("====================================================");

            var json = result.Response.Trim();

            // Remove markdown code fences if Ollama adds them
            if (json.StartsWith("```"))
            {
                var firstNewLine = json.IndexOf('\n');
                if (firstNewLine >= 0) json = json[(firstNewLine + 1)..];
                
                var closingFence = json.LastIndexOf("```");
                if (closingFence >= 0) json = json[..closingFence];
                
                json = json.Trim();
            }

            // Extract the JSON object if there's extra text
            var objectStart = json.IndexOf('{');
            var objectEnd = json.LastIndexOf('}');

            if (objectStart >= 0 && objectEnd > objectStart)
            {
                json = json.Substring(objectStart, objectEnd - objectStart + 1);
            }

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            TaskBreakdownResponse? breakdown = null;

            try
            {
                breakdown = JsonSerializer.Deserialize<TaskBreakdownResponse>(json, options);
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Ollama Task Breakdown JSON parsing error: {ex.Message}");
                Console.WriteLine($"Ollama response: {result.Response}");
            }

            if (breakdown == null || breakdown.Tasks == null || breakdown.Tasks.Count == 0)
            {
                Console.WriteLine("Ollama returned no valid AI tasks. Returning empty list.");
                return new TaskBreakdownResponse();
            }

            Console.WriteLine($"Successfully parsed {breakdown.Tasks.Count} AI suggested tasks.");
            return breakdown;
        }
        catch (TaskCanceledException)
        {
            Console.WriteLine("AI task breakdown request timed out.");
            return new TaskBreakdownResponse();
        }
        catch (HttpRequestException ex)
        {
            Console.WriteLine($"Could not connect to Ollama for task breakdown: {ex.Message}");
            return new TaskBreakdownResponse();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"AI task breakdown generation error: {ex}");
            return new TaskBreakdownResponse();
        }
    }
    // ============================================================
    // OLLAMA RESPONSE
    // ============================================================

    private class OllamaResponse
    {
        public string Response { get; set; } =
            string.Empty;
    }
}