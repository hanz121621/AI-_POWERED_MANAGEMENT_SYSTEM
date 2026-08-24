using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.Auth
{
    public class RefreshTokenRequestDto
    {
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
    }
}