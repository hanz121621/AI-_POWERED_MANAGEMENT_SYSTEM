using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Tasks
{
    public class SetTaskDeadlineDto
    {
        [Required]
        public DateTime DueDate { get; set; }
    }
}