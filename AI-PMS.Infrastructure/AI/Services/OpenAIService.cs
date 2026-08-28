using System.Net.Http.Json;
using System.Text.Json;
using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using AI_PMS.Infrastructure.AI.Configuration;
using Microsoft.Extensions.Options;

namespace AI_PMS.Infrastructure.AI.Services;

public class OpenAIService : IAIService
{
    private readonly HttpClient _httpClient;
    private readonly AIOptions _options;

    public OpenAIService(
        IHttpClientFactory httpClientFactory,
        IOptions<AIOptions> options)
    {
        _httpClient = httpClientFactory.CreateClient();

        _options = options.Value;

        _httpClient.BaseAddress =
            new Uri(_options.OllamaUrl.TrimEnd('/') + "/");

        _httpClient.Timeout =
            TimeSpan.FromMinutes(5);
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

                stream = false,

                // Give llama3.2:1b enough space
                // to generate all 3 subtasks.
                num_predict = 500,

                // Ask Ollama for JSON.
                format = "json",

                options = new
                {
                    // Small model works better with
                    // deterministic output.
                    temperature = 0.0
                }
            };

            using var response =
                await _httpClient.PostAsJsonAsync(
                    "api/generate",
                    payload);

            var responseBody =
                await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return new AIResponse
                {
                    Success = false,
                    Content = string.Empty,
                    ErrorMessage =
                        $"Ollama returned HTTP {(int)response.StatusCode}: {responseBody}"
                };
            }

            using var document =
                JsonDocument.Parse(responseBody);

            var root =
                document.RootElement;

            if (!root.TryGetProperty(
                    "response",
                    out var responseElement))
            {
                return new AIResponse
                {
                    Success = false,
                    Content = string.Empty,
                    ErrorMessage =
                        "Ollama response does not contain the 'response' property."
                };
            }

            var content =
                responseElement.GetString() ?? string.Empty;

            if (string.IsNullOrWhiteSpace(content))
            {
                return new AIResponse
                {
                    Success = false,
                    Content = string.Empty,
                    ErrorMessage =
                        "Ollama returned an empty response."
                };
            }

            return new AIResponse
            {
                Success = true,
                Content = content
            };
        }
        catch (TaskCanceledException)
        {
            return new AIResponse
            {
                Success = false,
                Content = string.Empty,
                ErrorMessage =
                    "Ollama request timed out. The local model took too long to respond."
            };
        }
        catch (HttpRequestException ex)
        {
            return new AIResponse
            {
                Success = false,
                Content = string.Empty,
                ErrorMessage =
                    $"Cannot connect to Ollama: {ex.Message}"
            };
        }
        catch (JsonException ex)
        {
            return new AIResponse
            {
                Success = false,
                Content = string.Empty,
                ErrorMessage =
                    $"Invalid response from Ollama: {ex.Message}"
            };
        }
        catch (Exception ex)
        {
            return new AIResponse
            {
                Success = false,
                Content = string.Empty,
                ErrorMessage =
                    $"Ollama error: {ex.Message}"
            };
        }
    }
}