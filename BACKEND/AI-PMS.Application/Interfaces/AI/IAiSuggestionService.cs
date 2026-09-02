using AI_PMS.Application.DTOs.Projects;
using AI_PMS.Application.DTOs.Tasks;

namespace AI_PMS.Application.Interfaces.AI
{
    public interface IAiSuggestionService
    {
        Task<string?> AnalyzeProjectAsync(ProjectDto project);

        Task<string?> AnalyzeTaskAsync(TaskDto task);
    }
}