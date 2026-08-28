
using System.Text.Json;
using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;

namespace AI_PMS.Infrastructure.AI.Services;

public class TaskDecompositionService : ITaskDecompositionService
{
    private readonly IAIService _aiService;

    public TaskDecompositionService(
        IAIService aiService)
    {
        _aiService = aiService;
    }

    public async Task<TaskDecompositionResponse> DecomposeTaskAsync(
        TaskDecompositionRequest request,
        TaskSize taskSize)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.Title))
        {
            throw new ArgumentException(
                "Task title is required.",
                nameof(request));
        }

        var prompt = BuildPrompt(request, taskSize);

        AIResponse aiResponse;

        try
        {
            aiResponse = await _aiService.GenerateResponseAsync(
                new AIRequest
                {
                    Prompt = prompt
                });
        }
        catch (TaskCanceledException)
        {
            throw new InvalidOperationException(
                "Ollama request timed out.");
        }
        catch (HttpRequestException ex)
        {
            throw new InvalidOperationException(
                "Could not connect to Ollama at http://localhost:11434.",
                ex);
        }

        if (!aiResponse.Success ||
            string.IsNullOrWhiteSpace(aiResponse.Content))
        {
            throw new InvalidOperationException(
                aiResponse.ErrorMessage ??
                "Ollama failed to generate a response.");
        }
        Console.WriteLine("========================================");
        Console.WriteLine("OLLAMA RAW RESPONSE");
        Console.WriteLine(aiResponse.Content);
        Console.WriteLine("========================================");

        var json = CleanJson(
            aiResponse.Content);

        var completeJson =
            ExtractFirstJsonObject(json);
        if (string.IsNullOrWhiteSpace(completeJson))
        {
            throw new InvalidOperationException(
                "Ollama did not return valid JSON.");
        }

        try
        {
            using var document = JsonDocument.Parse(completeJson);

            var root = document.RootElement;

            if (!root.TryGetProperty(
                    "subtasks",
                    out var subtasksElement))
            {
                throw new InvalidOperationException(
                    "Ollama JSON does not contain a subtasks array.");
            }

            if (subtasksElement.ValueKind != JsonValueKind.Array)
            {
                throw new InvalidOperationException(
                    "Ollama subtasks must be an array.");
            }

            var subtasks = new List<SubtaskDto>();

            foreach (var item in subtasksElement.EnumerateArray())
            {
                if (item.ValueKind != JsonValueKind.Object)
                {
                    continue;
                }

                var title = GetStringProperty(
                    item,
                    "title");

                if (string.IsNullOrWhiteSpace(title))
                {
                    continue;
                }

                var description = GetStringProperty(
                    item,
                    "description");

                var complexity = GetStringProperty(
                    item,
                    "complexity");

                if (string.IsNullOrWhiteSpace(complexity))
                {
                    complexity = "Medium";
                }

                double estimatedHours = 0;

                if (item.TryGetProperty(
                        "estimatedHours",
                        out var hoursElement))
                {
                    if (hoursElement.ValueKind == JsonValueKind.Number)
                    {
                        hoursElement.TryGetDouble(
                            out estimatedHours);
                    }
                    else if (
                        hoursElement.ValueKind ==
                        JsonValueKind.String)
                    {
                        double.TryParse(
                            hoursElement.GetString(),
                            out estimatedHours);
                    }
                }

                var dependencies = ExtractDependencies(item);

                subtasks.Add(
                    new SubtaskDto
                    {
                        Title = title,
                        Description = description,
                        Complexity = complexity,
                        EstimatedHours = estimatedHours,
                        Dependencies = dependencies
                    });
            }

            if (subtasks.Count == 0)
            {
                throw new InvalidOperationException(
                    "Ollama returned a valid JSON object, but no valid subtasks were found.");
            }

            /*
             * IMPORTANT:
             *
             * We do NOT throw an exception if the small local
             * model returns fewer subtasks than requested.
             *
             * llama3.2:1b can sometimes return fewer items.
             * The generated subtasks are still usable.
             */

            return new TaskDecompositionResponse
            {
                Subtasks = subtasks
            };
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException(
                "Ollama returned invalid JSON.",
                ex);
        }
    }

    private static string BuildPrompt(
        TaskDecompositionRequest request,
        TaskSize taskSize)
    {
        var rules = taskSize switch
        {
            TaskSize.Small =>
                """
                Create exactly 3 clear subtasks.
                Keep them simple.
                Avoid duplicate subtasks.
                """,

            TaskSize.Medium =>
                """
                Create 4 to 5 clear subtasks.
                Break the task into practical development steps.
                Avoid duplicate or overlapping subtasks.
                """,

            TaskSize.Large =>
                """
                Create 4 to 5 clear subtasks.
                Each subtask must represent a different major implementation activity.
                Avoid duplicate or overlapping subtasks.
                """,

            TaskSize.VeryLarge =>
                """
                Create 5 to 6 clear subtasks.
                Break the project into major implementation modules.
                Each subtask must represent a different implementation activity.
                Do not create nested subtasks.
                Avoid duplicate or overlapping subtasks.
                Keep each subtask concise.
                """,

            _ =>
                """
                Create 3 clear subtasks.
                """
        };

        return
            "You are an AI project management assistant.\n\n" +

            $"TASK SIZE: {taskSize}\n\n" +

            rules + "\n\n" +

            "IMPORTANT JSON RULES:\n" +
            "1. Return ONLY one JSON object.\n" +
            "2. The JSON object must contain a subtasks array.\n" +
            "3. Do not write explanations before or after the JSON.\n" +
            "4. Do not use Markdown.\n" +
            "5. Do not use ```.\n" +
            "6. Every subtask must have a title.\n" +
            "7. Every subtask must have a description.\n" +
            "8. Every subtask must have a complexity.\n" +
            "9. Every subtask must have estimatedHours.\n" +
            "10. Every subtask must have dependencies.\n" +
            "11. dependencies must be an array of strings.\n" +
            "12. estimatedHours must be a number.\n" +
            "13. Do not create duplicate subtasks.\n" +
            "14. Make sure every opening { has a matching }.\n" +
            "15. Make sure every opening [ has a matching ].\n" +
            "16. Make sure the JSON is complete before you stop generating.\n\n" +

            "JSON FORMAT:\n" +

            "{\n" +
            "  \"subtasks\": [\n" +
            "    {\n" +
            "      \"title\": \"Create login form\",\n" +
            "      \"description\": \"Build the login form interface\",\n" +
            "      \"complexity\": \"Low\",\n" +
            "      \"estimatedHours\": 2,\n" +
            "      \"dependencies\": []\n" +
            "    }\n" +
            "  ]\n" +
            "}\n\n" +

            "TASK TITLE:\n" +
            request.Title + "\n\n" +

            "TASK DESCRIPTION:\n" +
            (request.Description ?? "");
    }

    private static string CleanJson(string content)
    {
        var json = content.Trim();

        if (json.StartsWith("```"))
        {
            json = json
                .Replace("```json", "")
                .Replace("```JSON", "")
                .Replace("```", "")
                .Trim();
        }

        var firstBrace = json.IndexOf('{');

        if (firstBrace >= 0)
        {
            json = json.Substring(firstBrace);
        }

        return json;
    }

    private static string GetStringProperty(
        JsonElement element,
        string propertyName)
    {
        if (!element.TryGetProperty(
                propertyName,
                out var property))
        {
            return string.Empty;
        }

        if (property.ValueKind == JsonValueKind.String)
        {
            return property.GetString() ?? string.Empty;
        }

        return property.ToString();
    }

    private static List<string> ExtractDependencies(
        JsonElement item)
    {
        var dependencies = new List<string>();

        if (!item.TryGetProperty(
                "dependencies",
                out var dependencyElement))
        {
            return dependencies;
        }

        if (dependencyElement.ValueKind != JsonValueKind.Array)
        {
            return dependencies;
        }

        foreach (var dependency in
                 dependencyElement.EnumerateArray())
        {
            if (dependency.ValueKind == JsonValueKind.String)
            {
                var value = dependency.GetString();

                if (!string.IsNullOrWhiteSpace(value))
                {
                    dependencies.Add(value);
                }
            }
            else if (dependency.ValueKind == JsonValueKind.Object)
            {
                if (dependency.TryGetProperty(
                        "title",
                        out var titleElement))
                {
                    if (titleElement.ValueKind ==
                        JsonValueKind.String)
                    {
                        var value = titleElement.GetString();

                        if (!string.IsNullOrWhiteSpace(value))
                        {
                            dependencies.Add(value);
                        }
                    }
                }
            }
        }

        return dependencies;
    }

    private static string? ExtractFirstJsonObject(
        string text)
    {
        var depth = 0;
        var inString = false;
        var escaped = false;
        var startIndex = -1;

        for (var i = 0; i < text.Length; i++)
        {
            var character = text[i];

            if (escaped)
            {
                escaped = false;
                continue;
            }

            if (character == '\\' && inString)
            {
                escaped = true;
                continue;
            }

            if (character == '"')
            {
                inString = !inString;
                continue;
            }

            if (inString)
            {
                continue;
            }

            if (character == '{')
            {
                if (depth == 0)
                {
                    startIndex = i;
                }

                depth++;
            }
            else if (character == '}')
            {
                depth--;

                if (depth == 0 && startIndex >= 0)
                {
                    return text.Substring(
                        startIndex,
                        i - startIndex + 1);
                }

                if (depth < 0)
                {
                    return null;
                }
            }
        }

        return null;
    }
}

