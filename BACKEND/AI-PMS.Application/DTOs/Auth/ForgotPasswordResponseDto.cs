namespace AI_PMS.Application.DTOs.Auth
{
    public class ForgotPasswordResponseDto
    {
        public bool Success { get; set; }

        public string Message { get; set; } = string.Empty;
    }
}