using AI_PMS.Application.DTOs.Reports;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.Interfaces.Reports
{
    public interface ITeamLeaderTaskHistoryService
    {
        Task<List<TeamLeaderTaskHistoryDto>> GetTaskHistoryAsync(
            Guid teamLeaderId,
            Guid? teamMemberId = null,
            Guid? projectId = null,
            Guid? sprintId = null,
            ProjectTaskStatus? status = null,
            DateTime? startDate = null,
            DateTime? endDate = null,
            CancellationToken cancellationToken = default);

        Task<TeamLeaderTaskHistoryDto?> GetTaskHistoryByIdAsync(
            Guid teamLeaderId,
            Guid taskId,
            CancellationToken cancellationToken = default);
    }
}