using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Communication
{
    public class SendProjectAnnouncementDto
    {
        [Required]
        public Guid ProjectId { get; set; }

        public Guid? TeamId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(5000)]
        public string Message { get; set; } = string.Empty;

        [Required]
        public Guid PriorityId { get; set; }

        // =========================================================
        // OPTIONAL EXPLICIT RECIPIENTS
        // =========================================================
        //
        // If empty:
        //     system resolves current authorized team members.
        //
        // If supplied:
        //     every supplied user must belong to the authorized
        //     project/team scope.
        //

        public List<Guid> RecipientUserIds { get; set; }
            = new List<Guid>();
    }
}
