using System.ComponentModel.DataAnnotations;

namespace ReactTypescriptAspNetCoreMVC.Server.DTOs.Auth
{
    public class LoginDto
    {
        [Required]
        public string LoginIdentifier { get; set; } = "";
        [Required]
        [MinLength(8)]
        public string Password { get; set; } = "";
    }
}
