namespace ReactTypescriptAspNetCoreMVC.Server.DTOs
{
    // public class ProjectDto
    // {
    //     public int Id { get; set; }
    //     public string Name { get; set; } = string.Empty;
    //     public string AuthorId { get; set; } = string.Empty;
    //     public string AuthorEmail { get; set; } = string.Empty;
    // }
    // public class ProjectDto
    // {
    //     public int Id { get; set; }
    //     public required string Title { get; set; } = string.Empty;
    //     public required string Description { get; set; } = string.Empty;
    //     public required string SharedWithRole { get; set; } = string.Empty;
    //     public required string AuthorDisplayName { get; set; } = string.Empty;
    //     public required string AuthorEmail { get; set; } = string.Empty;
    //     // public string Author { get; set; }
    // }

    public class ProjectDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string? Description { get; set; }
        public string? SharedWithRole { get; set; }
        public string AuthorDisplayName { get; set; } = "Unknown";
        public string AuthorEmail { get; set; } = "unknown@example.com";
    }
}
