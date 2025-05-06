using System.ComponentModel.DataAnnotations;

namespace ReactTypescriptAspNetCoreMVC.Server.DTOs.Auth
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; } = string.Empty;
        [Required]
        [MinLength(8)]
        public string? Password { get; set; } = string.Empty;
        public string? Username { get; set; } = string.Empty;
        public string? FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; } = string.Empty;
        public string? DisplayName { get; set; } = string.Empty;
        public string? ColorRole { get; set; } = string.Empty;
    }
}
