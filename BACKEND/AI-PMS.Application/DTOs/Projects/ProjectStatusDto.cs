namespace AI_PMS.Application.DTOs.Projects
{
    public class ProjectStatusDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsActive { get; set; }

        public int DisplayOrder { get; set; }

        public bool IsInitialStatus { get; set; }

        public bool IsApprovedStatus { get; set; }

        public bool IsRejectedStatus { get; set; }

        public bool IsCompletedStatus { get; set; }

        public bool IsArchivedStatus { get; set; }

        public bool IsCancelledStatus { get; set; }
    }
}
