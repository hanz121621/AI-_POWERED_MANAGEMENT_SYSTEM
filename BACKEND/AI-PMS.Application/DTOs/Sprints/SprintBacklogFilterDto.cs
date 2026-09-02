
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Sprints
{
    public class SprintBacklogFilterDto
    {
        // =========================================================
        // FILTERS
        // =========================================================

        public ProjectTaskStatus? Status { get; set; }

        public TaskPriority? Priority { get; set; }

        public Guid? AssignedContributorId { get; set; }

        public DateTime? DeadlineFrom { get; set; }

        public DateTime? DeadlineTo { get; set; }

        // =========================================================
        // SORTING
        // =========================================================

        // Supported values:
        //
        // title
        // priority
        // status
        // deadline
        // contributor
        //
        public string? SortBy { get; set; }

        // asc / desc
        public string? SortDirection { get; set; }
    }
}

