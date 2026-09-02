using System.Text;
using System.Text.Json;

using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.DTOs.Tasks;
using AI_PMS.Application.Interfaces.AI;

namespace AI_PMS.Application.Services.AI
{
    public class AiSuggestionService : IAiSuggestionService
    {
        private readonly HttpClient _httpClient;

        public AiSuggestionService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // =====================================================
        // PROJECT AI ANALYSIS
        // =====================================================

        public async Task<string?> AnalyzeProjectAsync(
            ProjectDto project)
        {
            try
            {
                var prompt = $@"
You are an AI project management assistant.

Analyze the following project and automatically provide
a short useful suggestion.

Project Name: {project.Name}

Description: {project.Description}

Progress: {project.ProgressPercentage}%

Start Date: {project.StartDate:yyyy-MM-dd}

Deadline: {project.Deadline:yyyy-MM-dd}

Priority: {project.PriorityName}

Status: {project.StatusName}

Today: {DateTime.UtcNow:yyyy-MM-dd}

Rules:

1. Identify possible risks.
2. Check whether progress seems reasonable compared to time remaining.
3. Give one or more practical recommendations.
4. Keep the answer short.
5. Do not invent information.
6. If there is no significant problem, provide a positive improvement suggestion.

Return only the AI suggestion.
";

                return await AskOllamaAsync(prompt);
            }
            catch
            {
                return null;
            }
        }


        // =====================================================
        // TASK AI ANALYSIS
        // =====================================================

        public async Task<string?> AnalyzeTaskAsync(
            TaskDto task)
        {
            try
            {
                var prompt = $@"
You are an AI task management assistant.

Analyze this task and automatically provide
a useful management suggestion.

Task Title: {task.Title}

Description: {task.Description}

Priority: {task.Priority}

Status: {task.Status}

Estimated Hours: {task.EstimatedHours}

Actual Hours: {task.ActualHours}

Due Date: {task.DueDate:yyyy-MM-dd}

Today: {DateTime.UtcNow:yyyy-MM-dd}

Rules:

1. Identify risks or possible delays.
2. Compare estimated and actual hours.
3. Give a practical recommendation.
4. Keep the response short.
5. Do not invent information.

Return only the AI suggestion.
";

                return await AskOllamaAsync(prompt);
            }
            catch
            {
                return null;
            }
        }


        // =====================================================
        // OLLAMA REQUEST
        // =====================================================

        private async Task<string?> AskOllamaAsync(
            string prompt)
        {
            var requestBody = new
            {
                model = "llama3.2:3b",
                prompt = prompt,
                stream = false
            };

            var json =
                JsonSerializer.Serialize(requestBody);

            var content =
                new StringContent(
                    json,
                    Encoding.UTF8,
                    "application/json");

            var response =
                await _httpClient.PostAsync(
                    "/api/generate",
                    content);

            if (!response.IsSuccessStatusCode)
                return null;

            var responseContent =
                await response.Content.ReadAsStringAsync();

            using var document =
                JsonDocument.Parse(responseContent);

            if (document.RootElement.TryGetProperty(
                "response",
                out var aiResponse))
            {
                return aiResponse
                    .GetString()?
                    .Trim();
            }

            return null;
        }
    }
}