namespace AI_PMS.Application.DTOs.Auth
{
    public class RefreshTokenResponseDto
    {
        public string AccessToken { get; set; } = string.Empty;

        public string RefreshToken { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }

        public bool Success { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}