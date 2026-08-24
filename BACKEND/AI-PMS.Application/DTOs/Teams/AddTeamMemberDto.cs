using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Teams
{
    public class AddTeamMemberDto
    {
        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid ContributorTypeId { get; set; }

        // Required when contributor type requires a subtype.
        public Guid? ContributorSubTypeId { get; set; }
    }
}