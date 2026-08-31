
using AI_PMS.Application.DTOs.Teams;

namespace AI_PMS.Application.Interfaces.Teams
{
    public interface ITeamProgressService
    {
        Task<(
            bool Success,
            string Message,
            TeamProgressDto? Data
        )> ReviewTeamProgressAsync(
            Guid managerId,
            Guid teamId);
    }
}

