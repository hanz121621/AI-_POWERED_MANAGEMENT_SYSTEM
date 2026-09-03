namespace AI_PMS.Application.DTOs;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;

    public UserDto User { get; set; } = new();
}