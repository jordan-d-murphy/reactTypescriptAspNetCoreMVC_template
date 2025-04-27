using System.ComponentModel.DataAnnotations;

namespace ReactTypescriptAspNetCoreMVC.Server.DTOs
{
    public class RoleDto
    {
        [Required]
        public string? Username { get; set; } = string.Empty;
        [Required]
        public string? Role { get; set; } = string.Empty;
    }
}
