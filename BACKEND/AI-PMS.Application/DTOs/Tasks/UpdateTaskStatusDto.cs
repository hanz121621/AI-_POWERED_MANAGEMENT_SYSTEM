using AI_PMS.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Tasks
{
    public class UpdateTaskStatusDto
    {
        [Required]
        public ProjectTaskStatus Status { get; set; }

        [MaxLength(2000)]
        public string? ProgressNote { get; set; }

        [MaxLength(2000)]
        public string? Comment { get; set; }
    }
}