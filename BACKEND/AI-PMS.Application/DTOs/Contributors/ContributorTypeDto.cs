
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Contributors
{
    // ============================================================
    // CONTRIBUTOR TYPE DTO
    // ============================================================

    public class ContributorTypeDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int SubTypeCount { get; set; }
    }


    // ============================================================
    // CREATE CONTRIBUTOR TYPE DTO
    // ============================================================

    public class CreateContributorTypeDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }
    }


    // ============================================================
    // UPDATE CONTRIBUTOR TYPE DTO
    // ============================================================

    public class UpdateContributorTypeDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public bool IsActive { get; set; }
    }
}
