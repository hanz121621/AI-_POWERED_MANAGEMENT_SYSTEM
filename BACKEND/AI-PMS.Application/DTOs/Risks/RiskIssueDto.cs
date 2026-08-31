namespace AI_PMS.Application.DTOs.Risks
{
    public class RiskIssueDto
    {
        public Guid Id { get; set; }

        // Project
        public Guid ProjectId { get; set; }

        // Type
        public Guid TypeId { get; set; }
        public string TypeName { get; set; } = string.Empty;

        // Basic information
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Classification
        public Guid SeverityId { get; set; }
        public string SeverityName { get; set; } = string.Empty;

        public Guid PriorityId { get; set; }
        public string PriorityName { get; set; } = string.Empty;

        public Guid StatusId { get; set; }
        public string StatusName { get; set; } = string.Empty;

        public bool IsResolved { get; set; }

        // Reporter
        public Guid ReportedById { get; set; }
        public string ReportedByName { get; set; } = string.Empty;

        // Related Sprint
        public Guid? SprintId { get; set; }
        public string? SprintName { get; set; }

        // Related Task
        public Guid? TaskId { get; set; }
        public string? TaskTitle { get; set; }

        // Resolution
        public string? ResolutionInformation { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public Guid? ResolvedById { get; set; }
        public string? ResolvedByName { get; set; }

        // Audit
        public DateTime ReportedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
