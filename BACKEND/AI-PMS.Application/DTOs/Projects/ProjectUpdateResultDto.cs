namespace AI_PMS.Application.DTOs.Projects
{
    public class ProjectUpdateResultDto
    {
        public bool Success { get; set; }

        public string Message { get; set; } = string.Empty;

        public ProjectDto? Project { get; set; }
    }
}