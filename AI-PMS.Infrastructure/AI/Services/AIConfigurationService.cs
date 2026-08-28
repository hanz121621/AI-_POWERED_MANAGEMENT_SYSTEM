using AI_PMS.Application.DTOs;
using AI_PMS.Application.Interfaces;
using AI_PMS.Domain.Entities;
using AI_PMS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AI_PMS.Infrastructure.AI.Services;

public class AIConfigurationService : IAIConfigurationService
{
    private readonly ApplicationDbContext _context;

    public AIConfigurationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AIConfigurationDto?> GetAsync(
        CancellationToken cancellationToken = default)
    {
        var configuration = await _context.AIConfigurations
            .AsNoTracking()
            .FirstOrDefaultAsync(cancellationToken);

        if (configuration == null)
        {
            return null;
        }

        return new AIConfigurationDto
        {
            Id = configuration.Id,
            IsAIEnabled = configuration.IsAIEnabled,
            EnableRecommendations = configuration.EnableRecommendations,
            EnableRiskPrediction = configuration.EnableRiskPrediction,
            AnalysisFrequencyMinutes = configuration.AnalysisFrequencyMinutes,
            EnableNotifications = configuration.EnableNotifications,
            Model = configuration.Model
        };
    }

    public async Task<AIConfigurationDto> UpdateAsync(
        AIConfigurationDto dto,
        CancellationToken cancellationToken = default)
    {
        var configuration = await _context.AIConfigurations
            .FirstOrDefaultAsync(cancellationToken);

        if (configuration == null)
        {
            configuration = new AIConfiguration
            {
                Id = Guid.NewGuid(),
                IsAIEnabled = dto.IsAIEnabled,
                EnableRecommendations = dto.EnableRecommendations,
                EnableRiskPrediction = dto.EnableRiskPrediction,
                AnalysisFrequencyMinutes = dto.AnalysisFrequencyMinutes,
                EnableNotifications = dto.EnableNotifications,
                Model = dto.Model
            };

            _context.AIConfigurations.Add(configuration);
        }
        else
        {
            configuration.IsAIEnabled = dto.IsAIEnabled;
            configuration.EnableRecommendations = dto.EnableRecommendations;
            configuration.EnableRiskPrediction = dto.EnableRiskPrediction;
            configuration.AnalysisFrequencyMinutes = dto.AnalysisFrequencyMinutes;
            configuration.EnableNotifications = dto.EnableNotifications;
            configuration.Model = dto.Model;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new AIConfigurationDto
        {
            Id = configuration.Id,
            IsAIEnabled = configuration.IsAIEnabled,
            EnableRecommendations = configuration.EnableRecommendations,
            EnableRiskPrediction = configuration.EnableRiskPrediction,
            AnalysisFrequencyMinutes = configuration.AnalysisFrequencyMinutes,
            EnableNotifications = configuration.EnableNotifications,
            Model = configuration.Model
        };
    }
}