using System.Threading.Tasks;
using AI_PMS.Application.DTOs.AI;

namespace AI_PMS.Application.Interfaces.AI
{
    public interface IAiSuggestionService
    {
        Task<AiSuggestionResponseDto> GenerateSuggestionForProjectAsync(GenerateAiSuggestionRequestDto request);
        Task<string> TestAiConnectionAsync(string prompt);
    }
}