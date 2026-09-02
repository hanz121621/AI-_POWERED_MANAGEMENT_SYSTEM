using AI_PMS.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Tasks
{
    public class SetTaskPriorityDto
    {
        [Required]
        public TaskPriority Priority { get; set; }
    }
}