using System.ComponentModel.DataAnnotations;

namespace ReactTypescriptAspNetCoreMVC.Server.DTOs.Auth
{
    public class LoginDto
    {
        [Required]
        [MinLength(6)]
        public string Username { get; set; } = "";
        [Required]
        [MinLength(8)]
        public string Password { get; set; } = "";
    }
}
