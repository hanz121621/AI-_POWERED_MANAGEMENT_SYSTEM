
using AI_PMS.Application.DTOs.Teams;

namespace AI_PMS.Application.Interfaces.Teams
{
    public interface ITeamLeaderWorkMonitoringService
    {
        Task<(
            bool Success,
            string Message,
            TeamLeaderWorkMonitoringDto? Data
        )> MonitorTeamLeaderWorkAsync(
            Guid managerId,
            Guid teamId);
    }
}
