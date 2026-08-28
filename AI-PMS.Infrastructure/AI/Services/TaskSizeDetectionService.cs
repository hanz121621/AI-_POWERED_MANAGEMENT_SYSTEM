using System.Text.Json;
using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;

namespace AI_PMS.Infrastructure.AI.Services;

public class TaskSizeDetectionService : ITaskSizeDetectionService
{
    private readonly IAIService _aiService;

    public TaskSizeDetectionService(IAIService aiService)
    {
        _aiService = aiService;
    }

    public async Task<TaskSizeResponse> DetectTaskSizeAsync(
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

        var prompt =
            "You are a project management AI.\n\n" +

            "Classify this task as exactly ONE of:\n" +
            "Small\n" +
            "Medium\n" +
            "Large\n" +
            "VeryLarge\n\n" +

            "Definitions:\n" +
            "Small = simple task that needs about 3 subtasks.\n" +
            "Medium = task that needs about 5 to 8 subtasks.\n" +
            "Large = complex task involving multiple modules.\n" +
            "VeryLarge = very complex project involving many modules and implementation tasks.\n\n" +

            "IMPORTANT:\n" +
            "Return the answer in exactly this simple format:\n" +
            "SIZE: Large\n" +
            "REASON: Short explanation\n\n" +

            "Do not return JSON.\n" +
            "Do not use markdown.\n" +
            "Do not add anything before SIZE.\n\n" +

            "TASK TITLE:\n" +
            request.Title + "\n\n" +

            "TASK DESCRIPTION:\n" +
            (request.Description ?? "");

        var aiResponse =
            await _aiService.GenerateResponseAsync(
                new AIRequest
                {
                    Prompt = prompt
                });

        if (!aiResponse.Success ||
            string.IsNullOrWhiteSpace(aiResponse.Content))
        {
            throw new InvalidOperationException(
                aiResponse.ErrorMessage ??
                "AI failed to detect task size.");
        }

        var content = aiResponse.Content.Trim();

        Console.WriteLine("========================================");
        Console.WriteLine("OLLAMA TASK SIZE RESPONSE");
        Console.WriteLine(content);
        Console.WriteLine("========================================");

        var size = ParseTaskSizeFromText(content);

        var reason = ExtractReason(content);

        return new TaskSizeResponse
        {
            Size = size,
            Reason = reason
        };
    }

    private static TaskSize ParseTaskSizeFromText(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return TaskSize.Small;
        }

        var text = content
            .Trim()
            .ToLowerInvariant();

        // Check VeryLarge first because it contains "large".
        if (text.Contains("verylarge") ||
            text.Contains("very large"))
        {
            return TaskSize.VeryLarge;
        }

        if (text.Contains("large"))
        {
            return TaskSize.Large;
        }

        if (text.Contains("medium"))
        {
            return TaskSize.Medium;
        }

        if (text.Contains("small"))
        {
            return TaskSize.Small;
        }

        // If the model gives an unexpected answer,
        // use Small as the safest fallback.
        return TaskSize.Small;
    }

    private static string ExtractReason(string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return "AI classified the task based on its complexity.";
        }

        var reasonIndex =
            content.IndexOf(
                "REASON:",
                StringComparison.OrdinalIgnoreCase);

        if (reasonIndex >= 0)
        {
            var reason =
                content[(reasonIndex + 7)..].Trim();

            if (!string.IsNullOrWhiteSpace(reason))
            {
                return reason;
            }
        }

        return "AI classified the task based on its complexity.";
    }
}