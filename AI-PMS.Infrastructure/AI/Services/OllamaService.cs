using System.Net.Http.Json;
using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
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

        _httpClient.BaseAddress = new Uri(_options.OllamaUrl);

        // Local Ollama models can be slow when running on CPU.
        _httpClient.Timeout = TimeSpan.FromMinutes(10);
    }

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

            using var response = await _httpClient.PostAsJsonAsync(
                "/api/generate",
                payload);

            response.EnsureSuccessStatusCode();

            var result =
                await response.Content.ReadFromJsonAsync<OllamaResponse>();

            if (result == null ||
                string.IsNullOrWhiteSpace(result.Response))
            {
                return new AIResponse
                {
                    Content = string.Empty,
                    Success = false,
                    ErrorMessage = "Ollama returned an empty response."
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
                    "Ollama request timed out. " +
                    "The local AI model took too long to respond."
            };
        }
        catch (HttpRequestException ex)
        {
            return new AIResponse
            {
                Content = string.Empty,
                Success = false,
                ErrorMessage =
                    "Could not connect to Ollama: " + ex.Message
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

    private class OllamaResponse
    {
        public string Response { get; set; } = string.Empty;
    }
}