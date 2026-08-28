using AI_PMS.Application.DTOs;

namespace AI_PMS.Application.Interfaces;

public interface IAISuggestionService
{
    Task<List<AISuggestionDto>> GetAllAsync(
        CancellationToken cancellationToken = default);

    Task<AISuggestionDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default);

    Task<AISuggestionDto> CreateAsync(
        AISuggestionDto dto,
        CancellationToken cancellationToken = default);

    Task<bool> MarkAsReadAsync(
        Guid id,
        CancellationToken cancellationToken = default);
}