using System.ComponentModel.DataAnnotations;

namespace ReactTypescriptAspNetCoreMVC.Server.DTOs
{
    public class CreateProjectRequest
    {
        [Required]
        public required string Title { get; set; }

        public required string Description { get; set; }

        public required string SharedWithRole { get; set; }
    }
}


