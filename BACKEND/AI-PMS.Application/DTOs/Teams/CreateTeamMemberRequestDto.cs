
using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Teams
{
    public class CreateTeamMemberRequestDto
    {
        [Required]
        public Guid ProjectId { get; set; }

        [Required]
        public Guid TeamId { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public TeamMemberRequestType RequestType { get; set; }

        [MaxLength(1000)]
        public string? Reason { get; set; }
    }
}
