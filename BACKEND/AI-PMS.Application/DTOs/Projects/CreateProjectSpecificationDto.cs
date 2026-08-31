using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Projects
{
    public class CreateProjectSpecificationDto
    {
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
    }
}
