using System.ComponentModel.DataAnnotations;

namespace AI_PMS.Application.DTOs.UserPreferences;

public class CreateCustomThemeDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string PrimaryColor { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string BackgroundColor { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string SidebarColor { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string TextColor { get; set; } = string.Empty;
}
