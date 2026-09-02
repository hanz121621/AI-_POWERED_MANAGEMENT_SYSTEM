using AI_PMS.Application.DTOs.Risks;
using AI_PMS.Application.Interfaces.Repositories.Risks;
using AI_PMS.Application.Interfaces.Risks;
using AI_PMS.Domain.Entities.Risks;



namespace AI_PMS.Application.Services.Risks
{
    public class RiskIssueService : IRiskIssueService
    {
        private readonly IRiskIssueRepository _riskIssueRepository;

        public RiskIssueService(
            IRiskIssueRepository riskIssueRepository)
        {
            _riskIssueRepository = riskIssueRepository;
        }

        // =========================================================
        // REPORT-003
        // VIEW PROJECT RISKS AND ISSUES
        // =========================================================

        public async Task<IEnumerable<RiskIssueDto>>
            GetProjectRisksAndIssuesAsync(
                Guid projectId,
                Guid managerId,
                RiskIssueFilterDto? filter = null,
                CancellationToken cancellationToken = default)
        {
            // =====================================================
            // VALIDATE PROJECT ID
            // =====================================================

            if (projectId == Guid.Empty)
            {
                throw new ArgumentException(
                    "Invalid project ID.",
                    nameof(projectId));
            }

            // =====================================================
            // VALIDATE MANAGER ID
            // =====================================================

            if (managerId == Guid.Empty)
            {
                throw new UnauthorizedAccessException(
                    "Invalid manager identity.");
            }

            // =====================================================
            // GET PROJECT MANAGER
            // =====================================================

            var assignedManagerId =
                await _riskIssueRepository.GetProjectManagerIdAsync(
                    projectId,
                    cancellationToken);

            // Project does not exist
            if (assignedManagerId == null)
            {
                throw new KeyNotFoundException(
                    "Project not found.");
            }

            // =====================================================
            // MANAGER AUTHORIZATION
            // =====================================================

            if (assignedManagerId.Value != managerId)
            {
                throw new UnauthorizedAccessException(
                    "You are not authorized to view risks and issues for this project.");
            }

            // =====================================================
            // GET DATABASE RECORDS
            // =====================================================

         IEnumerable<RiskIssue> records =
    await _riskIssueRepository.GetByProjectAsync(
        projectId,
        cancellationToken);

            // =====================================================
            // FILTERING
            // =====================================================

            if (filter != null)
            {
                // -------------------------------------------------
                // TYPE
                // -------------------------------------------------

                if (filter.TypeId.HasValue)
                {
                    records = records.Where(
                        x => x.TypeId == filter.TypeId.Value);
                }

                // -------------------------------------------------
                // SEVERITY
                // -------------------------------------------------

                if (filter.SeverityId.HasValue)
                {
                    records = records.Where(
                        x => x.SeverityId == filter.SeverityId.Value);
                }

                // -------------------------------------------------
                // PRIORITY
                // -------------------------------------------------

                if (filter.PriorityId.HasValue)
                {
                    records = records.Where(
                        x => x.PriorityId == filter.PriorityId.Value);
                }

                // -------------------------------------------------
                // STATUS
                // -------------------------------------------------

                if (filter.StatusId.HasValue)
                {
                    records = records.Where(
                        x => x.StatusId == filter.StatusId.Value);
                }

                // -------------------------------------------------
                // SPRINT
                // -------------------------------------------------

                if (filter.SprintId.HasValue)
                {
                    records = records.Where(
                        x => x.SprintId == filter.SprintId.Value);
                }

                // -------------------------------------------------
                // TASK
                // -------------------------------------------------

                if (filter.TaskId.HasValue)
                {
                    records = records.Where(
                        x => x.TaskId == filter.TaskId.Value);
                }

                // -------------------------------------------------
                // SEARCH
                // -------------------------------------------------

                if (!string.IsNullOrWhiteSpace(filter.Search))
                {
                    var search =
                        filter.Search.Trim();

                    records = records.Where(x =>
                        x.Title.Contains(
                            search,
                            StringComparison.OrdinalIgnoreCase)
                        ||
                        (
                            x.Description != null &&
                            x.Description.Contains(
                                search,
                                StringComparison.OrdinalIgnoreCase)
                        ));
                }

                // =================================================
                // SORTING
                // =================================================

                records = filter.SortBy?.ToLowerInvariant() switch
                {
                    "title" =>
                        filter.Descending
                            ? records.OrderByDescending(x => x.Title)
                            : records.OrderBy(x => x.Title),

                    "severity" =>
                        filter.Descending
                            ? records.OrderByDescending(
                                x => x.Severity != null
                                    ? x.Severity.Name
                                    : string.Empty)
                            : records.OrderBy(
                                x => x.Severity != null
                                    ? x.Severity.Name
                                    : string.Empty),

                    "priority" =>
                        filter.Descending
                            ? records.OrderByDescending(
                                x => x.Priority != null
                                    ? x.Priority.Name
                                    : string.Empty)
                            : records.OrderBy(
                                x => x.Priority != null
                                    ? x.Priority.Name
                                    : string.Empty),

                    "status" =>
                        filter.Descending
                            ? records.OrderByDescending(
                                x => x.Status != null
                                    ? x.Status.Name
                                    : string.Empty)
                            : records.OrderBy(
                                x => x.Status != null
                                    ? x.Status.Name
                                    : string.Empty),

                    "reportedat" =>
                        filter.Descending
                            ? records.OrderByDescending(x => x.ReportedAt)
                            : records.OrderBy(x => x.ReportedAt),

                    _ =>
                        records.OrderByDescending(x => x.ReportedAt)
                };
            }
            else
            {
                records = records.OrderByDescending(
                    x => x.ReportedAt);
            }

            // =====================================================
            // MAP TO DTO
            // =====================================================

            return records.Select(x => new RiskIssueDto
            {
                Id = x.Id,

                ProjectId = x.ProjectId,

                // -------------------------------------------------
                // TYPE
                // -------------------------------------------------

                TypeId = x.TypeId,

                TypeName =
                    x.Type?.Name ?? "Unavailable",

                // -------------------------------------------------
                // BASIC INFORMATION
                // -------------------------------------------------

                Title = x.Title,

                Description = x.Description,

                // -------------------------------------------------
                // SEVERITY
                // -------------------------------------------------

                SeverityId = x.SeverityId,

                SeverityName =
                    x.Severity?.Name ?? "Unavailable",

                // -------------------------------------------------
                // PRIORITY
                // -------------------------------------------------

                PriorityId = x.PriorityId,

                PriorityName =
                    x.Priority?.Name ?? "Unavailable",

                // -------------------------------------------------
                // STATUS
                // -------------------------------------------------

                StatusId = x.StatusId,

                StatusName =
                    x.Status?.Name ?? "Unavailable",

                IsResolved =
                    x.Status?.IsResolved ?? false,

                // -------------------------------------------------
                // REPORTED BY
                // -------------------------------------------------

                ReportedById = x.ReportedById,

                ReportedByName =
    x.ReportedBy != null
        ? x.ReportedBy.FullName
        : "Unavailable",

                // -------------------------------------------------
                // RELATED SPRINT
                // -------------------------------------------------

                SprintId = x.SprintId,

                SprintName =
                    x.Sprint?.Name,

                // -------------------------------------------------
                // RELATED TASK
                // -------------------------------------------------

                TaskId = x.TaskId,

                TaskTitle =
                    x.Task?.Title,

                // -------------------------------------------------
                // RESOLUTION
                // -------------------------------------------------

                ResolutionInformation =
                    x.ResolutionInformation,

                ResolvedAt =
                    x.ResolvedAt,

                ResolvedById =
                    x.ResolvedById,

               ResolvedByName =
    x.ResolvedBy != null
        ? x.ResolvedBy.FullName
        : null,

                // -------------------------------------------------
                // DATES
                // -------------------------------------------------

                ReportedAt =
                    x.ReportedAt,

                UpdatedAt =
                    x.UpdatedAt
            }).ToList();
        }
    }
}
