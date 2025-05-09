namespace ReactTypescriptAspNetCoreMVC.Server.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string OwnerId { get; set; } = string.Empty;
        public AppUser? Author { get; set; } // ← Navigation property
        public string? SharedWithRole { get; set; } // e.g., "Admin", "Premium"
        public List<TaskItem> Tasks { get; set; } = new();
    }
}
