
using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Teams
{
    public class ReviewTeamMemberRequestDto
    {
        [Required]
        public bool Approve { get; set; }

        [MaxLength(1000)]
        public string? Comment { get; set; }
    }
}