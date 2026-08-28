using AI_PMS.Domain.Entities.Communication;

namespace AI_PMS.Application.Interfaces.Repositories.Communication
{
    public interface IProjectAnnouncementRepository
    {
        Task AddAsync(ProjectAnnouncement announcement);

        Task<ProjectAnnouncement?> GetByIdAsync(
            Guid id);

        Task<List<ProjectAnnouncement>>
            GetByProjectAsync(Guid projectId);
    }
}