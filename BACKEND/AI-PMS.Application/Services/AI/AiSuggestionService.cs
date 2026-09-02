using System;
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
                // 🌟 Fetch dynamic settings from DB via Repository
                var dbSettings = await _repository.GetAiSettingsAsync();
                
                // Block request if Admin disabled AI
                if (dbSettings != null && !dbSettings.IsAiEnabled)
                {
                    throw new InvalidOperationException("AI features are currently disabled by the system administrator.");
                }

                // Use DB settings if they exist, otherwise fallback to appsettings.json defaults
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
                var aiSuggestionDto = JsonSerializer.Deserialize<AiSuggestionResponseDto>(aiRawText, options);

                if (aiSuggestionDto == null)
                {
                    throw new InvalidOperationException("AI returned an empty or invalid JSON response.");
                }

                // 🌟 NEW: Save suggestion to Database via Repository
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

                // 🌟 AI-003: Log successful usage
                var responseTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                var usageLog = new AiUsageLog
                {
                    FeatureType = "Suggestion",
                    ProjectId = request.ProjectId,
                    Status = "Success",
                    ModelUsed = activeModel,
                    ResponseTimeMs = responseTime,
                    CreatedAt = DateTime.UtcNow
                };
                await _repository.LogAiUsageAsync(usageLog);

                _logger.LogInformation("Successfully generated and saved AI suggestion for project {ProjectId}", request.ProjectId);
                
                aiSuggestionDto.Id = newSuggestion.Id;
                return aiSuggestionDto;
            }
            catch (Exception ex)
            {
                // 🌟 AI-003: Log failed usage
                var responseTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                var usageLog = new AiUsageLog
                {
                    FeatureType = "Suggestion",
                    ProjectId = request.ProjectId,
                    Status = "Failed",
                    ModelUsed = _modelName,
                    ResponseTimeMs = responseTime,
                    ErrorMessage = ex.Message,
                    CreatedAt = DateTime.UtcNow
                };
                await _repository.LogAiUsageAsync(usageLog);

                _logger.LogError(ex, "Failed to generate AI suggestion for project {ProjectId}", request.ProjectId);
                throw new InvalidOperationException("AI service is currently unavailable. Please try again later.", ex);
            }
        }

        public async Task<string> TestAiConnectionAsync(string prompt)
        {
            var startTime = DateTime.UtcNow;

            try
            {
                // 🌟 Also use repository settings for the test connection
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

                // 🌟 AI-003: Log successful test
                var responseTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                var usageLog = new AiUsageLog
                {
                    FeatureType = "Test",
                    Status = "Success",
                    ModelUsed = activeModel,
                    ResponseTimeMs = responseTime,
                    CreatedAt = DateTime.UtcNow
                };
                await _repository.LogAiUsageAsync(usageLog);

                return result;
            }
            catch (Exception ex)
            {
                // 🌟 AI-003: Log failed test
                var responseTime = (int)(DateTime.UtcNow - startTime).TotalMilliseconds;
                var usageLog = new AiUsageLog
                {
                    FeatureType = "Test",
                    Status = "Failed",
                    ModelUsed = _modelName,
                    ResponseTimeMs = responseTime,
                    ErrorMessage = ex.Message,
                    CreatedAt = DateTime.UtcNow
                };
                await _repository.LogAiUsageAsync(usageLog);

                _logger.LogError(ex, "AI Connection Test failed.");
                throw new InvalidOperationException("Failed to connect to AI service.", ex);
            }
        }
    }
}