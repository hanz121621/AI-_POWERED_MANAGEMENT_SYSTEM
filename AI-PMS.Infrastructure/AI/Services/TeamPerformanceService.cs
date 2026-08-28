using System.Text;
using System.Text.Json;
using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using AI_PMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.AI.Services;

public class TeamPerformanceService : ITeamPerformanceService
{
    private readonly HttpClient _httpClient;
    private readonly ApplicationDbContext _dbContext;

    public TeamPerformanceService(
        HttpClient httpClient,
        ApplicationDbContext dbContext)
    {
        _httpClient = httpClient;
        _dbContext = dbContext;

        _httpClient.Timeout = TimeSpan.FromMinutes(5);
    }

    // =========================================================
    // MANUAL TEAM PERFORMANCE ANALYSIS
    // POST /api/TeamPerformance
    // =========================================================

    public async Task<TeamPerformanceResponse> AnalyzeTeamPerformanceAsync(
        TeamPerformanceRequest request)
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

        if (request.TeamMembers == null ||
            request.TeamMembers.Count == 0)
        {
            throw new ArgumentException(
                "At least one team member is required.",
                nameof(request));
        }

        return await AnalyzeAsync(request);
    }

    // =========================================================
    // DATABASE PROJECT ANALYSIS
    // POST /api/TeamPerformance/project/{projectId}
    // =========================================================

    public async Task<TeamPerformanceResponse>
        AnalyzeTeamPerformanceForProjectAsync(Guid projectId)
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

        if (project.Tasks == null ||
            project.Tasks.Count == 0)
        {
            throw new InvalidOperationException(
                $"Project '{project.Name}' does not contain any tasks.");
        }

        var teamMembers = project.Tasks
            .Where(t => t.AssignedUser != null)
            .GroupBy(t => t.AssignedUserId)
            .Select(group =>
            {
                var user = group.First().AssignedUser!;

                var totalTasks = group.Count();

                var completedTasks = group.Count(
                    t => t.Status.ToString()
                        .Equals(
                            "Done",
                            StringComparison.OrdinalIgnoreCase));

                var inProgressTasks = group.Count(
                    t =>
                        t.Status.ToString()
                            .Equals(
                                "InProgress",
                                StringComparison.OrdinalIgnoreCase)
                        ||
                        t.Status.ToString()
                            .Equals(
                                "In Progress",
                                StringComparison.OrdinalIgnoreCase));

                var blockedTasks = group.Count(
                    t => t.Status.ToString()
                        .Equals(
                            "Blocked",
                            StringComparison.OrdinalIgnoreCase));

                var overdueTasks = group.Count(
                    t =>
                        t.DueDate.HasValue &&
                        t.DueDate.Value < DateTime.UtcNow &&
                        !t.Status.ToString()
                            .Equals(
                                "Done",
                                StringComparison.OrdinalIgnoreCase));

                var estimatedHours = group.Sum(
                    t => t.EstimatedHours ?? 0);

                var actualHours = group.Sum(
                    t => t.ActualHours ?? 0);

                var completionRate = totalTasks == 0
                    ? 0
                    : Math.Round(
                        completedTasks * 100.0 / totalTasks,
                        2);

                return new TeamMemberPerformanceDto
                {
                    MemberName =
                        $"{user.FirstName} {user.LastName}".Trim(),

                    TotalTasks = totalTasks,

                    CompletedTasks = completedTasks,

                    InProgressTasks = inProgressTasks,

                    BlockedTasks = blockedTasks,

                    OverdueTasks = overdueTasks,

                    EstimatedHours = estimatedHours,

                    ActualHours = actualHours,

                    CompletionRate = completionRate
                };
            })
            .OrderByDescending(x => x.TotalTasks)
            .ToList();

        if (teamMembers.Count == 0)
        {
            throw new InvalidOperationException(
                $"Project '{project.Name}' does not have any assigned team members.");
        }

        var request = new TeamPerformanceRequest
        {
            ProjectName = project.Name,
            TeamMembers = teamMembers
        };

        return await AnalyzeAsync(request);
    }

    // =========================================================
    // ANALYZE TEAM
    // =========================================================

    private async Task<TeamPerformanceResponse> AnalyzeAsync(
        TeamPerformanceRequest request)
    {
        var result = new TeamPerformanceResponse
        {
            ProjectName = request.ProjectName,
            TeamMembers = request.TeamMembers,
            KeyFindings = new List<string>(),
            Recommendations = new List<string>()
        };

        var totalTasks = request.TeamMembers.Sum(
            x => x.TotalTasks);

        var completedTasks = request.TeamMembers.Sum(
            x => x.CompletedTasks);

        var blockedTasks = request.TeamMembers.Sum(
            x => x.BlockedTasks);

        var overdueTasks = request.TeamMembers.Sum(
            x => x.OverdueTasks);

        var estimatedHours = request.TeamMembers.Sum(
            x => x.EstimatedHours);

        var actualHours = request.TeamMembers.Sum(
            x => x.ActualHours);

        var completionRate = totalTasks == 0
            ? 0
            : Math.Round(
                completedTasks * 100.0 / totalTasks,
                2);

        // -----------------------------------------------------
        // KEY FINDINGS
        // -----------------------------------------------------

        if (completionRate >= 80)
        {
            result.KeyFindings.Add(
                $"The team has a strong completion rate of {completionRate}%.");
        }
        else if (completionRate >= 50)
        {
            result.KeyFindings.Add(
                $"The team has a moderate completion rate of {completionRate}%.");
        }
        else
        {
            result.KeyFindings.Add(
                $"The team has a low completion rate of {completionRate}%.");
        }

        if (blockedTasks > 0)
        {
            result.KeyFindings.Add(
                $"{blockedTasks} blocked task(s) are affecting team progress.");
        }

        if (overdueTasks > 0)
        {
            result.KeyFindings.Add(
                $"{overdueTasks} overdue task(s) require attention.");
        }

        if (actualHours > estimatedHours &&
            estimatedHours > 0)
        {
            result.KeyFindings.Add(
                "Actual recorded hours exceed the estimated hours.");
        }

        var highestWorkload =
            request.TeamMembers
                .OrderByDescending(x => x.TotalTasks)
                .FirstOrDefault();

        if (highestWorkload != null)
        {
            result.KeyFindings.Add(
                $"{highestWorkload.MemberName} has the highest number of assigned tasks.");
        }

        // -----------------------------------------------------
        // BASIC RECOMMENDATIONS
        // -----------------------------------------------------

        if (blockedTasks > 0)
        {
            result.Recommendations.Add(
                "Review blocked tasks and resolve their dependencies or issues.");
        }

        if (overdueTasks > 0)
        {
            result.Recommendations.Add(
                "Review overdue tasks and consider adjusting workload or priorities.");
        }

        var overloadedMembers = request.TeamMembers
            .Where(x =>
                x.TotalTasks >= 5 ||
                x.EstimatedHours >= 40)
            .ToList();

        if (overloadedMembers.Count > 0)
        {
            result.Recommendations.Add(
                "Review workload distribution and consider redistributing tasks where appropriate.");
        }

        if (result.Recommendations.Count == 0)
        {
            result.Recommendations.Add(
                "Continue monitoring team performance and task progress.");
        }

        // -----------------------------------------------------
        // OLLAMA
        // -----------------------------------------------------

        var aiResult = await GetAIAnalysisAsync(
            request,
            totalTasks,
            completedTasks,
            completionRate,
            blockedTasks,
            overdueTasks);

        if (!string.IsNullOrWhiteSpace(
                aiResult.OverallAnalysis))
        {
            result.OverallAnalysis =
                aiResult.OverallAnalysis;
        }
        else
        {
            result.OverallAnalysis =
                $"The team completed {completedTasks} of {totalTasks} tasks, resulting in a completion rate of {completionRate}%.";
        }

        foreach (var finding in aiResult.KeyFindings)
        {
            if (!string.IsNullOrWhiteSpace(finding) &&
                !result.KeyFindings.Contains(
                    finding,
                    StringComparer.OrdinalIgnoreCase))
            {
                result.KeyFindings.Add(finding);
            }
        }

        foreach (var recommendation in aiResult.Recommendations)
        {
            if (!string.IsNullOrWhiteSpace(recommendation) &&
                !result.Recommendations.Contains(
                    recommendation,
                    StringComparer.OrdinalIgnoreCase))
            {
                result.Recommendations.Add(recommendation);
            }
        }

        return result;
    }

    // =========================================================
    // OLLAMA ANALYSIS
    // =========================================================

    private async Task<AIAnalysisResult> GetAIAnalysisAsync(
        TeamPerformanceRequest request,
        int totalTasks,
        int completedTasks,
        double completionRate,
        int blockedTasks,
        int overdueTasks)
    {
        var teamJson = JsonSerializer.Serialize(
            request.TeamMembers,
            new JsonSerializerOptions
            {
                WriteIndented = true
            });

        var prompt =
            "You are an AI project management assistant.\n\n" +

            $"PROJECT: {request.ProjectName}\n\n" +

            "TEAM DATA:\n" +
            teamJson + "\n\n" +

            $"TOTAL TASKS: {totalTasks}\n" +
            $"COMPLETED TASKS: {completedTasks}\n" +
            $"COMPLETION RATE: {completionRate}%\n" +
            $"BLOCKED TASKS: {blockedTasks}\n" +
            $"OVERDUE TASKS: {overdueTasks}\n\n" +

            "Analyze team performance using ONLY the supplied data.\n\n" +

            "RULES:\n" +
            "1. Do not invent team members.\n" +
            "2. Do not invent tasks.\n" +
            "3. Do not invent statistics.\n" +
            "4. Do not make personal judgments.\n" +
            "5. Focus on project work metrics.\n" +
            "6. Results are advisory only.\n" +
            "7. Return 1 to 3 findings.\n" +
            "8. Return 1 to 3 recommendations.\n\n" +

            "Return ONLY JSON:\n" +
            "{\n" +
            "  \"overallAnalysis\": \"Short analysis\",\n" +
            "  \"keyFindings\": [\"Finding 1\"],\n" +
            "  \"recommendations\": [\"Recommendation 1\"]\n" +
            "}";

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
                num_predict = 500
            }
        };

        var requestJson =
            JsonSerializer.Serialize(ollamaRequest);

        using var content = new StringContent(
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
            return new AIAnalysisResult();
        }

        if (!response.IsSuccessStatusCode)
        {
            return new AIAnalysisResult();
        }

        var responseBody =
            await response.Content.ReadAsStringAsync();

        if (string.IsNullOrWhiteSpace(responseBody))
        {
            return new AIAnalysisResult();
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
            return new AIAnalysisResult();
        }

        if (ollamaResponse == null ||
            string.IsNullOrWhiteSpace(
                ollamaResponse.Response))
        {
            return new AIAnalysisResult();
        }

        var cleanJson =
            CleanJsonResponse(
                ollamaResponse.Response);

        if (string.IsNullOrWhiteSpace(cleanJson))
        {
            return new AIAnalysisResult();
        }

        try
        {
            return JsonSerializer.Deserialize<AIAnalysisResult>(
                       cleanJson,
                       new JsonSerializerOptions
                       {
                           PropertyNameCaseInsensitive = true
                       })
                   ?? new AIAnalysisResult();
        }
        catch
        {
            return new AIAnalysisResult();
        }
    }

    // =========================================================
    // CLEAN JSON
    // =========================================================

    private static string CleanJsonResponse(
        string response)
    {
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
    // OLLAMA RESPONSE
    // =========================================================

    private sealed class OllamaResponse
    {
        public string Response { get; set; } =
            string.Empty;
    }

    // =========================================================
    // AI RESULT
    // =========================================================

    private sealed class AIAnalysisResult
    {
        public string OverallAnalysis { get; set; } =
            string.Empty;

        public List<string> KeyFindings { get; set; } =
            new();

        public List<string> Recommendations { get; set; } =
            new();
    }
}