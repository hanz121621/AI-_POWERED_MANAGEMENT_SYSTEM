using System;
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.AI
{
    public class AiSettingsAuditLog
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string AdminUserName { get; set; } = "Unknown Admin";

        [Required]
        public string PreviousSettingsJson { get; set; } = string.Empty;

        [Required]
        public string NewSettingsJson { get; set; } = string.Empty;

        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
    }
}