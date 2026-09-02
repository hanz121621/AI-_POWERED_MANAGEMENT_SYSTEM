using AI_PMS.Domain.Entities.Communication;

namespace AI_PMS.Application.Interfaces.Repositories.Communication
{
    public interface IProjectAnnouncementRecipientRepository
    {
        Task AddRangeAsync(
            IEnumerable<ProjectAnnouncementRecipient> recipients);

        Task<List<ProjectAnnouncementRecipient>>
            GetByAnnouncementIdAsync(Guid announcementId);
    }
}
