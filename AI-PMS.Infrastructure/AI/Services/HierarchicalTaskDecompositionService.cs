using System.Text.Json;
using AI_PMS.Application.DTOs;
using AI_PMS.Application.DTOs.Hierarchy;
using AI_PMS.Application.Interfaces;

namespace AI_PMS.Infrastructure.AI.Services;

public class HierarchicalTaskDecompositionService
    : IHierarchicalTaskDecompositionService
{
    private readonly IAIService _aiService;

    public HierarchicalTaskDecompositionService(
        IAIService aiService)
    {
        _aiService = aiService;
    }

    public async Task<HierarchicalTaskDecompositionResponse>
        DecomposeVeryLargeTaskAsync(
            TaskDecompositionRequest request)
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

        var prompt = BuildPrompt(request);

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
        Console.WriteLine("OLLAMA HIERARCHICAL RAW RESPONSE");
        Console.WriteLine(aiResponse.Content);
        Console.WriteLine("========================================");

        var json = CleanJson(aiResponse.Content);

        var completeJson = ExtractFirstJsonObject(json);

        if (string.IsNullOrWhiteSpace(completeJson))
        {
            throw new InvalidOperationException(
                "Ollama did not return valid JSON.");
        }

        try
        {
            using var document =
                JsonDocument.Parse(completeJson);

            var root = document.RootElement;

            var response =
                new HierarchicalTaskDecompositionResponse
                {
                    TaskTitle = GetStringProperty(
                        root,
                        "taskTitle"),

                    TaskSize = GetStringProperty(
                        root,
                        "taskSize")
                };

            if (string.IsNullOrWhiteSpace(response.TaskTitle))
            {
                response.TaskTitle = request.Title;
            }

            if (string.IsNullOrWhiteSpace(response.TaskSize))
            {
                response.TaskSize = "VeryLarge";
            }

            if (!root.TryGetProperty(
                    "modules",
                    out var modulesElement))
            {
                throw new InvalidOperationException(
                    "Ollama JSON does not contain a modules array.");
            }

            if (modulesElement.ValueKind != JsonValueKind.Array)
            {
                throw new InvalidOperationException(
                    "Ollama modules must be an array.");
            }

            foreach (var moduleElement in
                     modulesElement.EnumerateArray())
            {
                if (moduleElement.ValueKind !=
                    JsonValueKind.Object)
                {
                    continue;
                }

                var moduleTitle =
                    GetStringProperty(
                        moduleElement,
                        "title");

                if (string.IsNullOrWhiteSpace(moduleTitle))
                {
                    continue;
                }

                var moduleDescription =
                    GetStringProperty(
                        moduleElement,
                        "description");

                var module =
                    new TaskModuleDto
                    {
                        Title = moduleTitle,
                        Description = moduleDescription
                    };

                if (moduleElement.TryGetProperty(
                        "subtasks",
                        out var subtasksElement) &&
                    subtasksElement.ValueKind ==
                    JsonValueKind.Array)
                {
                    foreach (var subtaskElement in
                             subtasksElement.EnumerateArray())
                    {
                        if (subtaskElement.ValueKind !=
                            JsonValueKind.Object)
                        {
                            continue;
                        }

                        var subtaskTitle =
                            GetStringProperty(
                                subtaskElement,
                                "title");

                        if (string.IsNullOrWhiteSpace(
                                subtaskTitle))
                        {
                            continue;
                        }

                        var subtask =
                            new TaskSubtaskDto
                            {
                                Title = subtaskTitle,

                                Description =
                                    GetStringProperty(
                                        subtaskElement,
                                        "description"),

                                Complexity =
                                    GetStringProperty(
                                        subtaskElement,
                                        "complexity"),

                                EstimatedHours =
                                    GetDoubleProperty(
                                        subtaskElement,
                                        "estimatedHours"),

                                Dependencies =
                                    ExtractStringArray(
                                        subtaskElement,
                                        "dependencies")
                            };

                        if (string.IsNullOrWhiteSpace(
                                subtask.Complexity))
                        {
                            subtask.Complexity = "Medium";
                        }

                        if (subtaskElement.TryGetProperty(
                                "implementationTasks",
                                out var implementationElement) &&
                            implementationElement.ValueKind ==
                            JsonValueKind.Array)
                        {
                            foreach (var implementationItem in
                                     implementationElement
                                         .EnumerateArray())
                            {
                                if (implementationItem.ValueKind !=
                                    JsonValueKind.Object)
                                {
                                    continue;
                                }

                                var implementationTitle =
                                    GetStringProperty(
                                        implementationItem,
                                        "title");

                                if (string.IsNullOrWhiteSpace(
                                        implementationTitle))
                                {
                                    continue;
                                }

                                var implementationTask =
                                    new ImplementationTaskDto
                                    {
                                        Title =
                                            implementationTitle,

                                        Description =
                                            GetStringProperty(
                                                implementationItem,
                                                "description"),

                                        Complexity =
                                            GetStringProperty(
                                                implementationItem,
                                                "complexity"),

                                        EstimatedHours =
                                            GetDoubleProperty(
                                                implementationItem,
                                                "estimatedHours")
                                    };

                                if (string.IsNullOrWhiteSpace(
                                        implementationTask.Complexity))
                                {
                                    implementationTask.Complexity =
                                        "Low";
                                }

                                subtask.ImplementationTasks.Add(
                                    implementationTask);
                            }
                        }

                        module.Subtasks.Add(subtask);
                    }
                }

                response.Modules.Add(module);
            }

            if (response.Modules.Count == 0)
            {
                throw new InvalidOperationException(
                    "Ollama returned valid JSON, but no valid modules were found.");
            }

            return response;
        }
        catch (JsonException ex)
        {
            throw new InvalidOperationException(
                "Ollama returned invalid JSON.",
                ex);
        }
    }

    private static string BuildPrompt(
        TaskDecompositionRequest request)
    {
        return
            "You are an AI project management assistant.\n\n" +

            "TASK SIZE: VeryLarge\n\n" +

            "Your job is to decompose the task hierarchically.\n\n" +

            "Create:\n" +
            "1. Major implementation modules.\n" +
            "2. Subtasks inside each module.\n" +
            "3. Smaller implementation tasks inside each subtask.\n\n" +

            "IMPORTANT:\n" +
            "- Create 3 to 5 major modules.\n" +
            "- Each module should contain 2 to 4 subtasks.\n" +
            "- Each subtask may contain 1 to 3 implementation tasks.\n" +
            "- Do not create duplicate work.\n" +
            "- Keep titles concise.\n" +
            "- Keep descriptions practical and implementation-focused.\n" +
            "- Complexity should be Low, Medium, or High.\n" +
            "- estimatedHours must be a number.\n" +
            "- dependencies must be an array of strings.\n" +
            "- implementationTasks must be an array.\n\n" +

            "IMPORTANT JSON RULES:\n" +
            "1. Return ONLY one JSON object.\n" +
            "2. Do not write explanations before or after the JSON.\n" +
            "3. Do not use Markdown.\n" +
            "4. Do not use code fences.\n" +
            "5. Make sure every opening { has a matching }.\n" +
            "6. Make sure every opening [ has a matching ].\n" +
            "7. Make sure the JSON is complete before stopping.\n\n" +

            "JSON FORMAT:\n" +

            "{\n" +
            "  \"taskTitle\": \"Main task title\",\n" +
            "  \"taskSize\": \"VeryLarge\",\n" +
            "  \"modules\": [\n" +
            "    {\n" +
            "      \"title\": \"Authentication Module\",\n" +
            "      \"description\": \"Implement authentication functionality\",\n" +
            "      \"subtasks\": [\n" +
            "        {\n" +
            "          \"title\": \"User Login\",\n" +
            "          \"description\": \"Implement secure user login\",\n" +
            "          \"complexity\": \"Medium\",\n" +
            "          \"estimatedHours\": 4,\n" +
            "          \"dependencies\": [],\n" +
            "          \"implementationTasks\": [\n" +
            "            {\n" +
            "              \"title\": \"Create login endpoint\",\n" +
            "              \"description\": \"Implement the login API endpoint\",\n" +
            "              \"complexity\": \"Low\",\n" +
            "              \"estimatedHours\": 2\n" +
            "            }\n" +
            "          ]\n" +
            "        }\n" +
            "      ]\n" +
            "    }\n" +
            "  ]\n" +
            "}\n\n" +

            "TASK TITLE:\n" +
            request.Title + "\n\n" +

            "TASK DESCRIPTION:\n" +
            (request.Description ?? "");
    }

    private static string CleanJson(
        string content)
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

        if (property.ValueKind ==
            JsonValueKind.String)
        {
            return property.GetString() ??
                   string.Empty;
        }

        return property.ToString();
    }

    private static double GetDoubleProperty(
        JsonElement element,
        string propertyName)
    {
        if (!element.TryGetProperty(
                propertyName,
                out var property))
        {
            return 0;
        }

        if (property.ValueKind ==
            JsonValueKind.Number)
        {
            property.TryGetDouble(
                out var value);

            return value;
        }

        if (property.ValueKind ==
            JsonValueKind.String)
        {
            double.TryParse(
                property.GetString(),
                out var value);

            return value;
        }

        return 0;
    }

    private static List<string> ExtractStringArray(
        JsonElement element,
        string propertyName)
    {
        var result = new List<string>();

        if (!element.TryGetProperty(
                propertyName,
                out var property))
        {
            return result;
        }

        if (property.ValueKind !=
            JsonValueKind.Array)
        {
            return result;
        }

        foreach (var item in
                 property.EnumerateArray())
        {
            if (item.ValueKind ==
                JsonValueKind.String)
            {
                var value = item.GetString();

                if (!string.IsNullOrWhiteSpace(value))
                {
                    result.Add(value);
                }
            }
            else if (item.ValueKind ==
                     JsonValueKind.Object)
            {
                var title =
                    GetStringProperty(
                        item,
                        "title");

                if (!string.IsNullOrWhiteSpace(title))
                {
                    result.Add(title);
                }
            }
        }

        return result;
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

                if (depth == 0 &&
                    startIndex >= 0)
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