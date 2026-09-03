using System;
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.AI
{
    public class AiUsageLog
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string FeatureType { get; set; } = string.Empty; // "Suggestion", "RiskPrediction", "Test", etc.

        public Guid? ProjectId { get; set; }

        public Guid? UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Success"; // "Success", "Failed", "Blocked"

        [MaxLength(500)]
        public string ModelUsed { get; set; } = string.Empty;

        public int? ResponseTimeMs { get; set; }

        [MaxLength(1000)]
        public string ErrorMessage { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}