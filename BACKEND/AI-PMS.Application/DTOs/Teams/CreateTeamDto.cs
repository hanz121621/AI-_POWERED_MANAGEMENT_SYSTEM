using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Teams
{
    public class CreateTeamDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        // Optional. Manager can be assigned later.
        public Guid? ManagerId { get; set; }

        // Initial team members
        public List<AddTeamMemberDto> Members { get; set; } = new();
    }
}