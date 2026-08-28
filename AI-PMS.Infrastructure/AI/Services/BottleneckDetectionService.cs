using System.Text;
using System.Text.Json;
using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using AI_PMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.AI.Services;

public class BottleneckDetectionService : IBottleneckDetectionService
{
    private readonly HttpClient _httpClient;
    private readonly ApplicationDbContext _dbContext;
    private readonly IAISuggestionService _aiSuggestionService;

    public BottleneckDetectionService(
        HttpClient httpClient,
        ApplicationDbContext dbContext,
        IAISuggestionService aiSuggestionService)
    {
        _httpClient = httpClient;
        _dbContext = dbContext;
        _aiSuggestionService = aiSuggestionService;

        _httpClient.Timeout = TimeSpan.FromMinutes(5);
    }

    // =========================================================
    // 1. MANUAL BOTTLENECK DETECTION
    // POST /api/BottleneckDetection
    // =========================================================

    public async Task<BottleneckResponse> DetectBottlenecksAsync(
        BottleneckRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.ProjectName))
        {
            throw new ArgumentException(
                "Project name is required.",
                nameof(request));
        }

        if (request.Tasks == null || request.Tasks.Count == 0)
        {
            throw new ArgumentException(
                "At least one task is required.",
                nameof(request));
        }

        return await AnalyzeTasksAsync(request);
    }

    // =========================================================
    // 2. DATABASE PROJECT BOTTLENECK DETECTION
    // POST /api/BottleneckDetection/project/{projectId}
    // =========================================================

    public async Task<BottleneckResponse> DetectBottlenecksForProjectAsync(
        Guid projectId)
    {
        var project = await _dbContext.Projects
            .Include(p => p.Tasks)
            .ThenInclude(t => t.AssignedUser)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project == null)
        {
            throw new KeyNotFoundException(
                $"Project with ID '{projectId}' was not found.");
        }

        if (project.Tasks == null || project.Tasks.Count == 0)
        {
            throw new InvalidOperationException(
                $"Project '{project.Name}' does not contain any tasks.");
        }

        var tasks = project.Tasks
            .Select(task => new BottleneckTaskDto
            {
                Title = task.Title,

                Status = task.Status.ToString(),

                // Your TaskItem currently does not have Complexity.
                // Therefore Priority is used as the complexity indicator.
                Complexity = task.Priority.ToString(),

                EstimatedHours = task.EstimatedHours ?? 0,

                AssignedTo = task.AssignedUser == null
                    ? "Unassigned"
                    : $"{task.AssignedUser.FirstName} {task.AssignedUser.LastName}".Trim()
            })
            .ToList();

        var request = new BottleneckRequest
        {
            ProjectName = project.Name,
            Tasks = tasks
        };

        return await AnalyzeTasksAsync(request);
    }

    // =========================================================
    // 3. MAIN BOTTLENECK ANALYSIS
    // =========================================================

    private async Task<BottleneckResponse> AnalyzeTasksAsync(
        BottleneckRequest request)
    {
        var result = new BottleneckResponse
        {
            Bottlenecks = new List<BottleneckItem>(),
            Recommendations = new List<string>()
        };

        // =====================================================
        // A. BLOCKED TASKS
        // =====================================================

        foreach (var task in request.Tasks)
        {
            if (string.Equals(
                    task.Status,
                    "Blocked",
                    StringComparison.OrdinalIgnoreCase))
            {
                result.Bottlenecks.Add(
                    CreateBottleneck(
                        task,
                        "The task is currently blocked and cannot progress.",
                        "High",
                        "Identify and remove the dependency or issue blocking this task."
                    ));
            }
        }

        // =====================================================
        // B. HIGH WORKLOAD
        // =====================================================

        foreach (var task in request.Tasks)
        {
            if (ContainsTask(result, task.Title))
            {
                continue;
            }

            if (task.EstimatedHours >= 30)
            {
                result.Bottlenecks.Add(
                    CreateBottleneck(
                        task,
                        $"The task has a high estimated workload of {task.EstimatedHours} hours.",
                        "High",
                        "Break the task into smaller subtasks and monitor its progress closely."
                    ));
            }
        }

        // =====================================================
        // C. HIGH COMPLEXITY
        // =====================================================

        foreach (var task in request.Tasks)
        {
            if (ContainsTask(result, task.Title))
            {
                continue;
            }

            if (string.Equals(
                    task.Complexity,
                    "High",
                    StringComparison.OrdinalIgnoreCase))
            {
                result.Bottlenecks.Add(
                    CreateBottleneck(
                        task,
                        "The task has high complexity and may require additional attention.",
                        "Medium",
                        "Review the task requirements and consider assigning additional support if necessary."
                    ));
            }
        }

        // =====================================================
        // D. DEVELOPER WORKLOAD CONCENTRATION
        // =====================================================

        var workloadByDeveloper = request.Tasks
            .Where(t =>
                !string.IsNullOrWhiteSpace(t.AssignedTo) &&
                !t.AssignedTo.Equals(
                    "Unassigned",
                    StringComparison.OrdinalIgnoreCase))
            .GroupBy(
                t => t.AssignedTo,
                StringComparer.OrdinalIgnoreCase)
            .Select(group => new
            {
                Developer = group.Key,
                TaskCount = group.Count(),
                TotalHours = group.Sum(t => t.EstimatedHours)
            })
            .ToList();

        foreach (var workload in workloadByDeveloper)
        {
            // Workload concentration rule:
            // 3+ tasks OR 50+ estimated hours
            if (workload.TaskCount >= 3 ||
                workload.TotalHours >= 50)
            {
                var developerTasks = request.Tasks
                    .Where(t =>
                        t.AssignedTo.Equals(
                            workload.Developer,
                            StringComparison.OrdinalIgnoreCase))
                    .ToList();

                foreach (var task in developerTasks)
                {
                    if (ContainsTask(result, task.Title))
                    {
                        continue;
                    }

                    result.Bottlenecks.Add(
                        CreateBottleneck(
                            task,
                            $"Workload concentration detected: {workload.Developer} has {workload.TaskCount} tasks totaling approximately {workload.TotalHours} estimated hours.",
                            "Medium",
                            $"Consider redistributing some tasks from {workload.Developer} to another available team member."
                        ));
                }
            }
        }

        // =====================================================
        // E. SORT BOTTLENECKS
        // =====================================================

        result.Bottlenecks = result.Bottlenecks
            .OrderByDescending(b => GetSeverityRank(b.Severity))
            .ToList();

        // =====================================================
        // F. BASIC RECOMMENDATIONS
        // =====================================================

        if (result.Bottlenecks.Count == 0)
        {
            result.Recommendations.Add(
                "No significant bottlenecks were detected. Continue monitoring task progress.");
        }
        else
        {
            var highCount = result.Bottlenecks.Count(
                b => b.Severity.Equals(
                    "High",
                    StringComparison.OrdinalIgnoreCase));

            var mediumCount = result.Bottlenecks.Count(
                b => b.Severity.Equals(
                    "Medium",
                    StringComparison.OrdinalIgnoreCase));

            if (highCount > 0)
            {
                result.Recommendations.Add(
                    $"Prioritize the {highCount} high-severity bottleneck task(s) before starting additional work.");
            }

            if (mediumCount > 0)
            {
                result.Recommendations.Add(
                    $"Monitor the {mediumCount} medium-severity task(s) closely and redistribute workload where necessary.");
            }
        }

        // =====================================================
        // G. ASK OLLAMA FOR ADDITIONAL RECOMMENDATIONS
        // =====================================================

        var aiRecommendations =
            await GetAIRecommendationsAsync(
                request,
                result.Bottlenecks);

        foreach (var recommendation in aiRecommendations)
        {
            if (!string.IsNullOrWhiteSpace(recommendation) &&
                !result.Recommendations.Contains(
                    recommendation,
                    StringComparer.OrdinalIgnoreCase))
            {
                result.Recommendations.Add(recommendation);
            }
        }

        // =====================================================
        // H. SAVE BOTTLENECK AI SUGGESTION
        // =====================================================

        if (result.Bottlenecks.Count > 0)
        {
            var highCount = result.Bottlenecks.Count(
                b => b.Severity.Equals(
                    "High",
                    StringComparison.OrdinalIgnoreCase));

            var priority = highCount > 0
                ? "High"
                : "Medium";

            var description =
                $"Detected {result.Bottlenecks.Count} bottleneck(s) " +
                $"in project '{request.ProjectName}'. " +
                $"{highCount} high-severity bottleneck(s) were detected.";

            await SaveAISuggestionAsync(
                request,
                result,
                priority,
                description);
        }

        return result;
    }

    // =========================================================
    // 4. CHECK DUPLICATE TASK
    // =========================================================

    private static bool ContainsTask(
        BottleneckResponse result,
        string taskTitle)
    {
        return result.Bottlenecks.Any(
            b => b.TaskTitle.Equals(
                taskTitle,
                StringComparison.OrdinalIgnoreCase));
    }

    // =========================================================
    // 5. CREATE BOTTLENECK
    // =========================================================

    private static BottleneckItem CreateBottleneck(
        BottleneckTaskDto task,
        string reason,
        string severity,
        string suggestedAction)
    {
        return new BottleneckItem
        {
            TaskTitle = task.Title,

            Reason = reason,

            Severity = severity,

            SuggestedActions = new List<string>
            {
                suggestedAction
            }
        };
    }

    // =========================================================
    // 6. SEVERITY RANK
    // =========================================================

    private static int GetSeverityRank(
        string severity)
    {
        if (severity.Equals(
                "High",
                StringComparison.OrdinalIgnoreCase))
        {
            return 3;
        }

        if (severity.Equals(
                "Medium",
                StringComparison.OrdinalIgnoreCase))
        {
            return 2;
        }

        return 1;
    }

    // =========================================================
    // 7. OLLAMA AI RECOMMENDATIONS
    // =========================================================

    private async Task<List<string>> GetAIRecommendationsAsync(
        BottleneckRequest request,
        List<BottleneckItem> bottlenecks)
    {
        if (bottlenecks.Count == 0)
        {
            return new List<string>();
        }

        var bottleneckData = bottlenecks
            .Select(b => new
            {
                b.TaskTitle,
                b.Reason,
                b.Severity
            })
            .ToList();

        var bottleneckJson =
            JsonSerializer.Serialize(
                bottleneckData,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                });

        var prompt =
            "You are an AI project management assistant.\n\n" +

            "PROJECT:\n" +
            request.ProjectName +
            "\n\n" +

            "DETECTED BOTTLENECKS:\n" +
            bottleneckJson +
            "\n\n" +

            "Provide useful project-level recommendations.\n\n" +

            "IMPORTANT RULES:\n" +
            "1. Do not identify new bottlenecks.\n" +
            "2. Do not invent task names.\n" +
            "3. Do not create fake tasks.\n" +
            "4. Do not use names such as Task 1 or Task 2.\n" +
            "5. Do not change severity.\n" +
            "6. Base recommendations only on supplied information.\n" +
            "7. Return 1 to 3 concise recommendations.\n\n" +

            "Return ONLY valid JSON:\n" +
            "{\n" +
            "  \"recommendations\": [\n" +
            "    \"Recommendation 1\",\n" +
            "    \"Recommendation 2\"\n" +
            "  ]\n" +
            "}";

        var ollamaRequest = new
        {
            model = "llama3.2:1b",
            prompt = prompt,
            stream = false,
            format = "json",
            options = new
            {
                num_ctx = 1024,
                temperature = 0.1,
                num_predict = 300
            }
        };

        var requestJson =
            JsonSerializer.Serialize(ollamaRequest);

        using var content =
            new StringContent(
                requestJson,
                Encoding.UTF8,
                "application/json");

        HttpResponseMessage response;

        try
        {
            response = await _httpClient.PostAsync(
                "http://127.0.0.1:11434/api/generate",
                content);
        }
        catch
        {
            // Ollama is optional.
            return new List<string>();
        }

        if (!response.IsSuccessStatusCode)
        {
            return new List<string>();
        }

        var responseBody =
            await response.Content.ReadAsStringAsync();

        if (string.IsNullOrWhiteSpace(responseBody))
        {
            return new List<string>();
        }

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
        catch
        {
            return new List<string>();
        }

        if (ollamaResponse == null ||
            string.IsNullOrWhiteSpace(
                ollamaResponse.Response))
        {
            return new List<string>();
        }

        var aiJson =
            CleanJsonResponse(
                ollamaResponse.Response);

        if (string.IsNullOrWhiteSpace(aiJson))
        {
            return new List<string>();
        }

        try
        {
            var aiResult =
                JsonSerializer.Deserialize<RecommendationResponse>(
                    aiJson,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

            return aiResult?.Recommendations?
                       .Where(r =>
                           !string.IsNullOrWhiteSpace(r))
                       .Take(3)
                       .ToList()
                   ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
    }

    // =========================================================
    // 8. SAVE AI SUGGESTION
    // =========================================================

    private async Task SaveAISuggestionAsync(
        BottleneckRequest request,
        BottleneckResponse result,
        string priority,
        string description)
    {
        try
        {
            var title =
                $"Bottleneck Detection - {request.ProjectName}";

            await _aiSuggestionService.CreateAsync(
                new AISuggestionDto
                {
                    ProjectId = null,

                    Type = "BottleneckDetection",

                    Title = title,

                    Description = description,

                    Priority = priority,

                    IsRead = false
                });
        }
        catch
        {
            // Saving the suggestion must not
            // break the bottleneck API response.
        }
    }

    // =========================================================
    // 9. CLEAN OLLAMA JSON
    // =========================================================

    private static string CleanJsonResponse(
        string response)
    {
        if (string.IsNullOrWhiteSpace(response))
        {
            return string.Empty;
        }

        response = response.Trim();

        if (response.StartsWith("```"))
        {
            response = response
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
                    firstBrace..(lastBrace + 1)];
        }

        return response.Trim();
    }

    // =========================================================
    // 10. OLLAMA RESPONSE
    // =========================================================

    private sealed class OllamaResponse
    {
        public string Response { get; set; }
            = string.Empty;
    }

    // =========================================================
    // 11. AI RECOMMENDATION RESPONSE
    // =========================================================

    private sealed class RecommendationResponse
    {
        public List<string>? Recommendations { get; set; }
    }
}