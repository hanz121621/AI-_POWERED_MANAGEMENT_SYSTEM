using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.Risks
{
    public class RiskIssueSeverity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<RiskIssue> RiskIssues { get; set; }
            = new List<RiskIssue>();
    }
}