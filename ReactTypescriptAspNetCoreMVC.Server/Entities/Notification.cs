namespace ReactTypescriptAspNetCoreMVC.Server.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public required string UserId { get; set; } // Foreign key to AppUser
        public required string Username { get; set; }
        public required string Message { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;

        public required AppUser User { get; set; } // Navigation property
    }

}
