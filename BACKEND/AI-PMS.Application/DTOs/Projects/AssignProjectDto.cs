using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Projects
{
    public class AssignProjectDto
    {
        [Required]
        public Guid ProjectId { get; set; }

        [Required]
        public Guid ManagerId { get; set; }
    }
}
