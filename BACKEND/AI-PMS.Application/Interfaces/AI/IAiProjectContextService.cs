using System;
using System.Threading.Tasks;
using AI_PMS.Application.DTOs.AI;

namespace AI_PMS.Application.Interfaces.AI
{
    public interface IAiProjectContextService
    {
        Task<ProjectAiContextDto> GetProjectContextAsync(Guid projectId, Guid managerId);
        Task<AiRiskPredictionDto> PredictProjectRiskAsync(ProjectAiContextDto context);
    }
}