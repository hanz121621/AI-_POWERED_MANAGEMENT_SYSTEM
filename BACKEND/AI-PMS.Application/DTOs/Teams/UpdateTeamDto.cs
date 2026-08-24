using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Teams
{
    public class UpdateTeamDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public Guid? ManagerId { get; set; }

        public bool IsActive { get; set; } = true;

        // Updated team members
        public List<AddTeamMemberDto> Members { get; set; } = new();
    }
}