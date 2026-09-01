using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Projects;
using AI_PMS.Domain.Entities.Sprints;
using AI_PMS.Domain.Entities.Tasks;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.Risks
{
    public class RiskIssue
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        // =========================================================
        // PROJECT
        // =========================================================

        [Required]
        public Guid ProjectId { get; set; }

        // =========================================================
        // TYPE
        // =========================================================

        [Required]
        public Guid TypeId { get; set; }

        // =========================================================
        // BASIC INFORMATION
        // =========================================================

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        // =========================================================
        // CONFIGURABLE CLASSIFICATIONS
        // =========================================================

        [Required]
        public Guid SeverityId { get; set; }

        [Required]
        public Guid PriorityId { get; set; }

        [Required]
        public Guid StatusId { get; set; }

        // =========================================================
        // REPORTING USER
        // =========================================================

        [Required]
        public Guid ReportedById { get; set; }

        // =========================================================
        // RELATED SPRINT / TASK
        // =========================================================

        public Guid? SprintId { get; set; }

        public Guid? TaskId { get; set; }

        // =========================================================
        // RESOLUTION
        // =========================================================

        [MaxLength(2000)]
        public string? ResolutionInformation { get; set; }

        public DateTime? ResolvedAt { get; set; }

        public Guid? ResolvedById { get; set; }

        // =========================================================
        // AUDIT
        // =========================================================

        public DateTime ReportedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // =========================================================
        // NAVIGATION
        // =========================================================

        public Project? Project { get; set; }

        public Sprint? Sprint { get; set; }

        public TaskItem? Task { get; set; }

        public User? ReportedBy { get; set; }

        public User? ResolvedBy { get; set; }

        public RiskIssueType? Type { get; set; }

        public RiskIssueSeverity? Severity { get; set; }

        public RiskIssuePriority? Priority { get; set; }

        public RiskIssueStatus? Status { get; set; }
    }
}