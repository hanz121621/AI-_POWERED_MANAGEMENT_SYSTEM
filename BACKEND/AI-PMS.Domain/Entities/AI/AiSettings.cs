using System;
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Domain.Entities.AI
{
    public class AiSettings
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        public string ModelName { get; set; } = "llama3.2";

        [Required]
        [MaxLength(255)]
        public string Endpoint { get; set; } = "http://localhost:11434";

        public bool IsAiEnabled { get; set; } = true;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}