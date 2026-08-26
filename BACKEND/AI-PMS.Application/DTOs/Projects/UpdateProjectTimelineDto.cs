using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Projects
{
    public class UpdateProjectTimelineDto
    {
        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime Deadline { get; set; }
    }
}