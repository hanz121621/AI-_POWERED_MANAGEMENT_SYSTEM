using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.Projects
{
    public class ProjectSpecification
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ProjectId { get; set; }

        // One Project -> One Specification
        public Project Project { get; set; } = null!;

        [Required]
        [MaxLength(5000)]
        public string Objectives { get; set; } = string.Empty;

        [Required]
        [MaxLength(5000)]
        public string Scope { get; set; } = string.Empty;

        [Required]
        [MaxLength(10000)]
        public string FunctionalRequirements { get; set; } = string.Empty;

        [Required]
        [MaxLength(10000)]
        public string NonFunctionalRequirements { get; set; } = string.Empty;

        [Required]
        [MaxLength(5000)]
        public string Deliverables { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string TechnologyStack { get; set; } = string.Empty;

        [MaxLength(5000)]
        public string? Assumptions { get; set; }

        [MaxLength(5000)]
        public string? Constraints { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}