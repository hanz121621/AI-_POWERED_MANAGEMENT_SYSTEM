using System.ComponentModel.DataAnnotations;
using AI_PMS.Domain.Entities.Users;

namespace AI_PMS.Domain.Entities.UserPreferences;

public class CustomTheme
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    // =========================================================
    // OWNER
    // =========================================================

    [Required]
    public Guid UserId { get; set; }

    public User? User { get; set; }

    // =========================================================
    // THEME INFORMATION
    // =========================================================

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    // =========================================================
    // COLORS
    // =========================================================

    [Required]
    [MaxLength(20)]
    public string PrimaryColor { get; set; } = "#2563EB";

    [Required]
    [MaxLength(20)]
    public string BackgroundColor { get; set; } = "#FFFFFF";

    [Required]
    [MaxLength(20)]
    public string SidebarColor { get; set; } = "#F3F4F6";

    [Required]
    [MaxLength(20)]
    public string TextColor { get; set; } = "#111827";

    // =========================================================
    // TIMESTAMPS
    // =========================================================

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}