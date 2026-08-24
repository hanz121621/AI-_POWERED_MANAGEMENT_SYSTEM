using AI_PMS.Domain.Entities.Users;


namespace AI_PMS.Domain.Entities.Auth
{
    public class RefreshToken
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        // The actual refresh token
        public string Token { get; set; } = string.Empty;

        // Expiration date
      public DateTime ExpiresAt { get; set; }

        // Indicates whether the token is revoked
        public bool IsRevoked { get; set; } = false;

        // Creation timestamp
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key
        public Guid UserId { get; set; }

        // Navigation Property
        public User User { get; set; } = null!;

        // Convenience Property
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    }
}