using AI_PMS.Application.DTOs.Communication;

namespace AI_PMS.Application.Interfaces.Communication
{
    public interface IProjectAnnouncementService
    {
        Task<ProjectAnnouncementDto>
            SendAnnouncementAsync(
                Guid managerId,
                SendProjectAnnouncementDto request);

        Task<List<ProjectAnnouncementDto>>
            GetProjectAnnouncementsAsync(
                Guid managerId,
                Guid projectId);
    }
}
