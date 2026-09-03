using System;
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.AI
{
    public class AiSuggestion
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ProjectId { get; set; }
        // Optional: Add navigation property later if needed

        [Required]
        [MaxLength(50)]
        public string SuggestionType { get; set; } = "General"; // Risk, Optimization, Timeline, etc.

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Priority { get; set; } = "Medium"; // High, Medium, Low

        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? ViewedAt { get; set; } // For tracking access (BR7)
    }
}