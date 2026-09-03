using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Projects
{
    public class CreateProjectSpecificationDto
    {
        [Required]
        public string Objectives { get; set; } = string.Empty;

        [Required]
        public string Scope { get; set; } = string.Empty;

        [Required]
        public string FunctionalRequirements { get; set; } = string.Empty;

        [Required]
        public string NonFunctionalRequirements { get; set; } = string.Empty;

        [Required]
        public string Deliverables { get; set; } = string.Empty;

        [Required]
        public string TechnologyStack { get; set; } = string.Empty;

        public string? Assumptions { get; set; }

        public string? Constraints { get; set; }
    }
}