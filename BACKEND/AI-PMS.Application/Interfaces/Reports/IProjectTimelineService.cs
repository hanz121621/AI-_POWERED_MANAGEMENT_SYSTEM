using AI_PMS.Application.DTOs.Reports;

namespace AI_PMS.Application.Interfaces.Reports
{
public interface IProjectTimelineService
{
Task<(
bool Success,
string Message,
ProjectTimelineDto? Data
)> GetProjectTimelineAsync(
Guid managerId,
Guid projectId);
}
}
