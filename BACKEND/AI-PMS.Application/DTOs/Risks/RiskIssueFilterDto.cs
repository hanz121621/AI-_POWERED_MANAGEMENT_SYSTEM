namespace AI_PMS.Application.DTOs.Risks
{
    public class RiskIssueFilterDto
    {
        public Guid? TypeId { get; set; }

        public Guid? SeverityId { get; set; }

        public Guid? PriorityId { get; set; }

        public Guid? StatusId { get; set; }

        public Guid? SprintId { get; set; }

        public Guid? TaskId { get; set; }

        public string? Search { get; set; }

        public string? SortBy { get; set; }

        public bool Descending { get; set; } = true;
    }
}
