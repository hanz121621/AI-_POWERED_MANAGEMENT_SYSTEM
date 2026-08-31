
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Contributors
{
    public class CreateContributorSubTypeDto
    {
        [Required]
        public Guid ContributorTypeId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
            = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }
    }
}

