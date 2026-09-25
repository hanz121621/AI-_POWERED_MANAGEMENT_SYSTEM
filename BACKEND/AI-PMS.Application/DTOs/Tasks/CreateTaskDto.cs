using System;
using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Tasks
{
    public class CreateTaskDto
    {
        [Required]
        public Guid SprintId { get; set; }

        // 🌟 ADDED: Link to Project (BR-010)
        public Guid? ProjectId { get; set; }

        // 🌟 ADDED: Link to Parent Task (BR-009, BR-020)
        public Guid? ParentTaskId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        public Guid? AssignedContributorSDId { get; set; }

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;

        [Range(0, int.MaxValue)]
        public int EstimatedHours { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        // 🌟 ADDED: AI Identification & Auditability (BR-011 & BR-016)
        public bool IsAiGenerated { get; set; } = false;
        public string? AiMetadata { get; set; }
    }
}