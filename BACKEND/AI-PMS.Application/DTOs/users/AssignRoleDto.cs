using AI_PMS.Domain.Entities;

namespace AI_PMS.Application.DTOs.Users
{
    public class AssignRoleDto
    {
        public Guid UserId { get; set; }

        public Role Role { get; set; }
    }
}