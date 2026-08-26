namespace AI_PMS.Application.DTOs.Projects
{
    public class ProjectSpecificationDto
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }

        public string Objectives { get; set; } = string.Empty;
        public string Scope { get; set; } = string.Empty;
        public string FunctionalRequirements { get; set; } = string.Empty;
        public string NonFunctionalRequirements { get; set; } = string.Empty;
        public string Deliverables { get; set; } = string.Empty;
        public string TechnologyStack { get; set; } = string.Empty;
        public string? Assumptions { get; set; }
        public string? Constraints { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    
}