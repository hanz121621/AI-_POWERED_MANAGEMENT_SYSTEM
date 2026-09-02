using AI_PMS.Application.DTOs.AI;

namespace AI_PMS.Application.Interfaces.AI;

public interface IAIService
{
    Task<AIResponse> GenerateResponseAsync(
        AIRequest request);

    Task<List<AISuggestion>>
        GenerateSuggestionsAsync(
            AISuggestionRequest request);
}