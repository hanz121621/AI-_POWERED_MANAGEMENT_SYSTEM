using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using AI_PMS.Domain.Entities;
using AI_PMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.AI.Services;

public class AISuggestionService : IAISuggestionService
{
    private readonly ApplicationDbContext _context;

    public AISuggestionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AISuggestionDto>> GetAllAsync(
        CancellationToken cancellationToken = default)
    {
        return await _context.AISuggestions
            .AsNoTracking()
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new AISuggestionDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                Type = x.Type,
                Title = x.Title,
                Description = x.Description,
                Priority = x.Priority,
                IsRead = x.IsRead,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<AISuggestionDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _context.AISuggestions
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new AISuggestionDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                Type = x.Type,
                Title = x.Title,
                Description = x.Description,
                Priority = x.Priority,
                IsRead = x.IsRead,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<AISuggestionDto> CreateAsync(
        AISuggestionDto dto,
        CancellationToken cancellationToken = default)
    {
        var suggestion = new AISuggestion
        {
            Id = Guid.NewGuid(),
            ProjectId = dto.ProjectId,
            Type = dto.Type,
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.AISuggestions.Add(suggestion);

        await _context.SaveChangesAsync(cancellationToken);

        dto.Id = suggestion.Id;
        dto.IsRead = suggestion.IsRead;
        dto.CreatedAt = suggestion.CreatedAt;

        return dto;
    }

    public async Task<bool> MarkAsReadAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var suggestion = await _context.AISuggestions
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (suggestion == null)
            return false;

        suggestion.IsRead = true;

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}