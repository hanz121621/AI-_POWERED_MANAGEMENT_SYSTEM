using AI_PMS.Domain.Enums;

namespace AI_PMS.Application.DTOs.Teams.TeamMemberRequests
{
    public class TeamMemberRequestDto
    {
        public Guid Id { get; set; }

        public Guid ProjectId { get; set; }

        public Guid TeamId { get; set; }

        public Guid ManagerId { get; set; }

        public Guid UserId { get; set; }

        public TeamMemberRequestType RequestType { get; set; }

        public string? Reason { get; set; }

        public TeamMemberRequestStatus Status { get; set; }

        public Guid? ReviewedByAdminId { get; set; }

        public DateTime? ReviewedAt { get; set; }

        public string? ReviewComment { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
