using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AI_PMS.Application.DTOs.AI;
using AI_PMS.Application.Interfaces.AI;
using AI_PMS.Application.Interfaces.Repositories.AI;
using AI_PMS.Domain.Entities.AI;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AI_PMS.Application.Services.AI
{
    public class AiSuggestionService : IAiSuggestionService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<AiSuggestionService> _logger;
        private readonly string _ollamaEndpoint;
        private readonly string _modelName;
        private readonly IAiSuggestionRepository _repository;

        public AiSuggestionService(
            HttpClient httpClient, 
            ILogger<AiSuggestionService> logger,
            IConfiguration configuration,
            IAiSuggestionRepository repository)
        {
            _httpClient = httpClient;
            _logger = logger;
            _repository = repository;
            _ollamaEndpoint = configuration["AiSettings:Endpoint"] ?? "http://localhost:11434";
            _modelName = configuration["AiSettings:ModelName"] ?? "llama3.2";
        }

        public async Task<AiSuggestionResponseDto> GenerateSuggestionForProjectAsync(GenerateAiSuggestionRequestDto request)
        {
            var startTime = DateTime.UtcNow;

            try
            {
                var dbSettings = await _repository.GetAiSettingsAsync();
                if (dbSettings != null && !dbSettings.IsAiEnabled)
                {
                    throw new InvalidOperationException("AI features are currently disabled by the system administrator.");
                }

                string activeModel = dbSettings?.ModelName ?? _modelName;
                string activeEndpoint = dbSettings?.Endpoint ?? _ollamaEndpoint;

                string prompt = $@"
You are an expert AI Project Manager. Analyze the following project data and provide exactly ONE actionable suggestion.
Focus on risk prediction, task optimization, or timeline warnings.

Project Data:
- Name: {request.ProjectName}
- Description: {request.ProjectDescription}
- Current Status: {request.CurrentStatus}
- Active Tasks: {request.ActiveTasks}
- Deadline: {request.Deadline}

Respond ONLY in valid JSON format with the following exact keys:
{{
  ""SuggestionType"": ""Risk"" | ""Optimization"" | ""Timeline"",
  ""Title"": ""A short, catchy title for the suggestion"",
  ""Description"": ""A detailed, 2-3 sentence explanation of the suggestion and why it matters."",
  ""Priority"": ""High"" | ""Medium"" | ""Low""
}}
Do not include markdown formatting. Just raw JSON.";

                var ollamaRequest = new { model = activeModel, prompt = prompt, stream = false };
                var jsonContent = new StringContent(JsonSerializer.Serialize(ollamaRequest), Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{activeEndpoint}/api/generate", jsonContent);
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                using var jsonDoc = JsonDocument.Parse(responseString);
                string aiRawText = jsonDoc.RootElement.GetProperty("response").GetString() ?? "";

                aiRawText = aiRawText.Replace("```json", "").Replace("```", "").Trim();
                int startIndex = aiRawText.IndexOf('{');
                int endIndex = aiRawText.LastIndexOf('}');
                if (startIndex != -1 && endIndex != -1 && endIndex > startIndex)
                {
                    aiRawText = aiRawText.Substring(startIndex, endIndex - startIndex + 1).Trim();
                }

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var aiSuggestionDto = JsonSerializer.Deserialize<AiSuggestionResponseDto>(aiRawText, options);

                if (aiSuggestionDto == null) throw new InvalidOperationException("AI returned an empty or invalid JSON response.");

                var newSuggestion = new AiSuggestion
                {
                    ProjectId = request.ProjectId,
                    SuggestionType = aiSuggestionDto.SuggestionType,
                    Title = aiSuggestionDto.Title,
                    Description = aiSuggestionDto.Description,
                    Priority = aiSuggestionDto.Priority,
                    GeneratedAt = DateTime.UtcNow
                };

                await _repository.AddAsync(newSuggestion);
                await _repository.SaveChangesAsync();

                var responseTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                await _repository.LogAiUsageAsync(new AiUsageLog
                {
                    FeatureType = "Suggestion",
                    ProjectId = request.ProjectId,
                    Status = "Success",
                    ModelUsed = activeModel,
                    ResponseTimeMs = responseTime,
                    CreatedAt = DateTime.UtcNow
                });

                aiSuggestionDto.Id = newSuggestion.Id;
                return aiSuggestionDto;
            }
            catch (Exception ex)
            {
                var responseTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                await _repository.LogAiUsageAsync(new AiUsageLog
                {
                    FeatureType = "Suggestion",
                    ProjectId = request.ProjectId,
                    Status = "Failed",
                    ModelUsed = _modelName,
                    ResponseTimeMs = responseTime,
                    ErrorMessage = ex.Message,
                    CreatedAt = DateTime.UtcNow
                });

                _logger.LogError(ex, "Failed to generate AI suggestion for project {ProjectId}", request.ProjectId);
                throw new InvalidOperationException("AI service is currently unavailable. Please try again later.", ex);
            }
        }

              public async Task<AiRiskPredictionDto> PredictProjectRiskAsync(Guid projectId, Guid managerId)
        {
            var startTime = DateTime.UtcNow;

            try
            {
                // 1. Get the project context (this also verifies authorization)
                var context = await _repository.GetProjectContextAsync(projectId, managerId);

                // 2. Get AI settings
                var dbSettings = await _repository.GetAiSettingsAsync();
                if (dbSettings != null && !dbSettings.IsAiEnabled)
                {
                    throw new InvalidOperationException("AI features are currently disabled by the system administrator.");
                }

                string activeModel = dbSettings?.ModelName ?? _modelName;
                string activeEndpoint = dbSettings?.Endpoint ?? _ollamaEndpoint;

                // 🌟 UPGRADED PROMPT: Forces the AI to be specific, critical, and analyze the description/tasks
                string descriptionAnalysis = string.IsNullOrWhiteSpace(context.Description) || context.Description == "No description provided." 
                    ? "UNCLEAR OR MISSING" 
                    : context.Description;

                string prompt = $@"
You are an expert AI Project Risk Analyst. Analyze the following project data and predict the project risk. Be highly specific and critical based *only* on the provided data.

Project Data:
- Name: {context.ProjectName}
- Description: {descriptionAnalysis}
- Status: {context.CurrentStatus}
- Deadline: {context.Deadline}
- Total Sprints: {context.TotalSprints} (Active: {context.ActiveSprints}, Current: {context.ActiveSprintName})
- Total Tasks: {context.TotalTasks}
- Completed Tasks: {context.CompletedTasks}
- Blocked Tasks: {context.BlockedTasks}
- Overdue Tasks: {context.OverdueTasks}
- Team Size: {context.TotalTeamMembers}

Analyze this data for potential risks. For example:
- If the description is unclear, short, or missing, flag it as a high risk for misalignment and scope creep.
- If there are blocked or overdue tasks, highlight them as critical risks.
- If the deadline is approaching and completion is low, flag timeline risk.
- If team size is very small (e.g., 1) for the workload, flag resource risk.

Respond ONLY in valid JSON format with the following exact keys:
{{
  ""RiskLevel"": ""Low"" | ""Medium"" | ""High"",
  ""RiskScore"": 0 to 100,
  ""Summary"": ""A concise 2-3 sentence summary of the overall project risk, explicitly mentioning the project name and its current status."",
  ""SupportingFactors"": [
    ""[High/Medium/Low Priority] Risk: [Specific observation based on the data above]. [Impact/Consequence]."",
    ""[High/Medium/Low Priority] Risk: [Specific observation based on the data above]. [Impact/Consequence].""
  ]
}}
Do not include markdown formatting (like ```json). Just raw JSON.";

                var ollamaRequest = new { model = activeModel, prompt = prompt, stream = false };
                var jsonContent = new StringContent(JsonSerializer.Serialize(ollamaRequest), Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{activeEndpoint}/api/generate", jsonContent);
                response.EnsureSuccessStatusCode();

                var responseString = await response.Content.ReadAsStringAsync();
                using var jsonDoc = JsonDocument.Parse(responseString);
                string aiRawText = jsonDoc.RootElement.GetProperty("response").GetString() ?? "";

                aiRawText = aiRawText.Replace("```json", "").Replace("```", "").Trim();
                int startIndex = aiRawText.IndexOf('{');
                int endIndex = aiRawText.LastIndexOf('}');
                if (startIndex != -1 && endIndex != -1 && endIndex > startIndex)
                {
                    aiRawText = aiRawText.Substring(startIndex, endIndex - startIndex + 1).Trim();
                }

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var riskDto = JsonSerializer.Deserialize<AiRiskPredictionDto>(aiRawText, options);

                if (riskDto == null) throw new InvalidOperationException("AI returned an empty or invalid JSON response.");

                riskDto.ProjectId = projectId;

                // 🌟 AI-003: Log successful usage
                var responseTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                var usageLog = new AiUsageLog
                {
                    FeatureType = "RiskPrediction",
                    ProjectId = projectId,
                    Status = "Success",
                    ModelUsed = activeModel,
                    ResponseTimeMs = responseTime,
                    CreatedAt = DateTime.UtcNow
                };
                await _repository.LogAiUsageAsync(usageLog);

                return riskDto;
            }
            catch (Exception ex)
            {
                // 🌟 AI-003: Log failed usage
                var responseTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                var usageLog = new AiUsageLog
                {
                    FeatureType = "RiskPrediction",
                    ProjectId = projectId,
                    Status = "Failed",
                    ModelUsed = _modelName,
                    ResponseTimeMs = responseTime,
                    ErrorMessage = ex.Message,
                    CreatedAt = DateTime.UtcNow
                };
                await _repository.LogAiUsageAsync(usageLog);

                _logger.LogError(ex, "Failed to predict project risk for project {ProjectId}", projectId);
                throw new InvalidOperationException("AI risk prediction service is currently unavailable.", ex);
            }
        }
                // =========================================================
        // AI-008: GENERATE AUTOMATED PROJECT SUMMARY
        // =========================================================
        public async Task<AiProjectSummaryDto> GenerateProjectSummaryAsync(Guid projectId, Guid managerId)
        {
            var context = await _repository.GetProjectContextAsync(projectId, managerId);

            string prompt = $@"
You are an expert AI Project Manager. Generate a concise, automated summary of the current project condition based ONLY on the following data.

Project Data:
- Name: {context.ProjectName}
- Status: {context.CurrentStatus}
- Deadline: {context.Deadline}
- Total Sprints: {context.TotalSprints} (Active: {context.ActiveSprints}, Current: {context.ActiveSprintName})
- Total Tasks: {context.TotalTasks}
- Completed Tasks: {context.CompletedTasks}
- Blocked Tasks: {context.BlockedTasks}
- Overdue Tasks: {context.OverdueTasks}
- Team Size: {context.TotalTeamMembers}

Provide the summary in valid JSON format with these exact keys:
{{
  ""OverallProgress"": ""A 1-2 sentence summary of the project's current progress and health."",
  ""KeyRisks"": [""Risk 1 based on data"", ""Risk 2 based on data""],
  ""RecentActivities"": ""A 1-2 sentence summary of what the team is currently working on."",
  ""NextSteps"": [""Actionable step 1"", ""Actionable step 2""]
}}
Do not include markdown formatting. Just raw JSON.";

            return await ExecuteAiJsonRequestAsync<AiProjectSummaryDto>(prompt, "ProjectSummary", projectId);
        }
        // =========================================================
        // AI-003: GENERATE PROJECT RECOMMENDATIONS
        // =========================================================
        public async Task<List<AiRecommendationDto>> GenerateProjectRecommendationsAsync(Guid projectId, Guid managerId)
        {
            var context = await _repository.GetProjectContextAsync(projectId, managerId);
            
            string prompt = $@"
You are an expert AI Project Manager. Analyze this project data and generate exactly 3 actionable recommendations to improve project performance.

Project Data:
- Status: {context.CurrentStatus}
- Deadline: {context.Deadline}
- Total Tasks: {context.TotalTasks} | Completed: {context.CompletedTasks} | Blocked: {context.BlockedTasks} | Overdue: {context.OverdueTasks}
- Active Sprints: {context.ActiveSprints}
- Team Size: {context.TotalTeamMembers}

Rules:
- Base recommendations ONLY on the data above.
- If blocked tasks > 0, recommend prioritizing blocker removal.
- If overdue tasks > 0, recommend timeline/scope adjustment.

Respond ONLY in valid JSON array format:
[
  {{
    ""Category"": ""Workload"" | ""Timeline"" | ""Process"" | ""Resources"",
    ""Priority"": ""High"" | ""Medium"" | ""Low"",
    ""Title"": ""Short, actionable title"",
    ""Description"": ""1-2 sentences explaining the observation based on data."",
    ""SuggestedAction"": ""Specific, actionable step the manager can take.""
  }}
]
Do not include markdown formatting. Just raw JSON.";

            return await ExecuteAiJsonRequestAsync<List<AiRecommendationDto>>(prompt, "Recommendations", projectId);
        }

        // =========================================================
        // AI-009: DETECT PROJECT BOTTLENECKS
        // =========================================================
        public async Task<List<AiBottleneckDto>> DetectProjectBottlenecksAsync(Guid projectId, Guid managerId)
        {
            var context = await _repository.GetProjectContextAsync(projectId, managerId);

            string prompt = $@"
You are an expert AI Project Analyst. Analyze this project data to detect up to 3 active bottlenecks slowing down progress.

Project Data:
- Status: {context.CurrentStatus}
- Deadline: {context.Deadline}
- Total Tasks: {context.TotalTasks} | Completed: {context.CompletedTasks} | Blocked: {context.BlockedTasks} | Overdue: {context.OverdueTasks}
- Active Sprints: {context.ActiveSprints}
- Team Size: {context.TotalTeamMembers}

Rules:
- Only identify bottlenecks explicitly supported by the data.
- Do not invent tasks or team members.

Respond ONLY in valid JSON array format:
[
  {{
    ""BottleneckType"": ""Blocked Tasks"" | ""Resource Constraint"" | ""Timeline Delay"" | ""Process Inefficiency"",
    ""Severity"": ""Critical"" | ""High"" | ""Medium"",
    ""AffectedArea"": ""e.g., Current Sprint, Testing, Development"",
    ""ContributingFactors"": ""1-2 sentences on why this is happening based on the data."",
    ""PotentialImpact"": ""1 sentence on the risk if not resolved."",
    ""SuggestedAction"": ""Immediate step to resolve it.""
  }}
]
Do not include markdown formatting. Just raw JSON.";

            return await ExecuteAiJsonRequestAsync<List<AiBottleneckDto>>(prompt, "Bottlenecks", projectId);
        }








                // =========================================================
        // HELPER: EXECUTE AI JSON REQUEST (Ultra-Debug Version)
        // =========================================================
        private async Task<T> ExecuteAiJsonRequestAsync<T>(string prompt, string featureType, Guid projectId)
        {
            var startTime = DateTime.UtcNow;
            try
            {
                Console.WriteLine($"[AI DEBUG] Starting {featureType} request...");
                var dbSettings = await _repository.GetAiSettingsAsync();
                string activeModel = dbSettings?.ModelName ?? _modelName;
                string activeEndpoint = dbSettings?.Endpoint ?? _ollamaEndpoint;
                Console.WriteLine($"[AI DEBUG] Model: {activeModel}, Endpoint: {activeEndpoint}");

                var ollamaRequest = new { model = activeModel, prompt = prompt, stream = false };
                var jsonContent = new StringContent(JsonSerializer.Serialize(ollamaRequest), Encoding.UTF8, "application/json");

                Console.WriteLine($"[AI DEBUG] Sending request to Ollama...");
                var response = await _httpClient.PostAsync($"{activeEndpoint}/api/generate", jsonContent);
                
                Console.WriteLine($"[AI DEBUG] Ollama Response Status: {response.StatusCode}");
                response.EnsureSuccessStatusCode(); // If this fails, it throws here

                var responseString = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"[AI DEBUG] Raw Ollama Response String Length: {responseString.Length}");
                Console.WriteLine($"[AI DEBUG] Raw Ollama Response: {responseString}");

                using var jsonDoc = JsonDocument.Parse(responseString);
                string aiRawText = jsonDoc.RootElement.GetProperty("response").GetString() ?? "";
                Console.WriteLine($"[AI DEBUG] Extracted AI Text: {aiRawText}");

                aiRawText = aiRawText.Replace("```json", "").Replace("```", "").Trim();

                int firstBracket = aiRawText.IndexOf('[');
                int firstBrace = aiRawText.IndexOf('{');
                int lastBracket = aiRawText.LastIndexOf(']');
                int lastBrace = aiRawText.LastIndexOf('}');

                int startIndex = -1;
                int endIndex = -1;

                if (firstBracket != -1 && (firstBrace == -1 || firstBracket < firstBrace))
                {
                    startIndex = firstBracket;
                    endIndex = lastBracket;
                }
                else if (firstBrace != -1)
                {
                    startIndex = firstBrace;
                    endIndex = lastBrace;
                }

                if (startIndex != -1 && endIndex != -1 && endIndex > startIndex)
                {
                    aiRawText = aiRawText.Substring(startIndex, endIndex - startIndex + 1).Trim();
                }

                Console.WriteLine($"[AI DEBUG] Final JSON to parse: {aiRawText}");

                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var result = JsonSerializer.Deserialize<T>(aiRawText, options);

                await _repository.LogAiUsageAsync(new AiUsageLog
                {
                    FeatureType = featureType,
                    ProjectId = projectId,
                    Status = "Success",
                    ModelUsed = activeModel,
                    ResponseTimeMs = (int)(DateTime.UtcNow - startTime).TotalMilliseconds,
                    CreatedAt = DateTime.UtcNow
                });

                return result ?? throw new InvalidOperationException("AI returned empty data.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ [AI DEBUG] CRITICAL ERROR in {featureType}: {ex.GetType().Name} - {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"❌ [AI DEBUG] Inner Exception: {ex.InnerException.Message}");
                }
                
                await _repository.LogAiUsageAsync(new AiUsageLog
                {
                    FeatureType = featureType,
                    ProjectId = projectId,
                    Status = "Failed",
                    ModelUsed = _modelName,
                    ResponseTimeMs = (int)(DateTime.UtcNow - startTime).TotalMilliseconds,
                    ErrorMessage = ex.Message,
                    CreatedAt = DateTime.UtcNow
                });
                throw new InvalidOperationException($"AI {featureType} generation failed: {ex.Message}", ex);
            }
        }








        
        public async Task<ProjectAiContextDto> GetProjectContextAsync(Guid projectId, Guid managerId)
        {
            return await _repository.GetProjectContextAsync(projectId, managerId);
        }

        public async Task<string> TestAiConnectionAsync(string prompt)
        {
            var startTime = DateTime.UtcNow;
            try
            {
                var dbSettings = await _repository.GetAiSettingsAsync();
                string activeModel = dbSettings?.ModelName ?? _modelName;
                string activeEndpoint = dbSettings?.Endpoint ?? _ollamaEndpoint;

                var ollamaRequest = new { model = activeModel, prompt = prompt, stream = false };
                var jsonContent = new StringContent(JsonSerializer.Serialize(ollamaRequest), Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{activeEndpoint}/api/generate", jsonContent);
                response.EnsureSuccessStatusCode();
                
                var responseString = await response.Content.ReadAsStringAsync();
                using var jsonDoc = JsonDocument.Parse(responseString);
                var result = jsonDoc.RootElement.GetProperty("response").GetString() ?? "No response received.";

                var responseTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                await _repository.LogAiUsageAsync(new AiUsageLog
                {
                    FeatureType = "Test",
                    Status = "Success",
                    ModelUsed = activeModel,
                    ResponseTimeMs = responseTime,
                    CreatedAt = DateTime.UtcNow
                });

                return result;
            }
            catch (Exception ex)
            {
                var responseTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                await _repository.LogAiUsageAsync(new AiUsageLog
                {
                    FeatureType = "Test",
                    Status = "Failed",
                    ModelUsed = _modelName,
                    ResponseTimeMs = responseTime,
                    ErrorMessage = ex.Message,
                    CreatedAt = DateTime.UtcNow
                });

                _logger.LogError(ex, "AI Connection Test failed.");
                throw new InvalidOperationException("Failed to connect to AI service.", ex);
            }
        }
    }
}