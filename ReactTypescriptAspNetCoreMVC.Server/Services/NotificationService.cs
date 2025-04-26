using Auth;
using Microsoft.AspNetCore.Identity;
using static AdminController;

public class NotificationService : INotificationService
{
    private readonly AuthDbContext _context;
    private readonly UserManager<AppUser> _userManager;


    public NotificationService(AuthDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task SendNotificationAsync(string username, string role, bool added)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentNullException("Username");

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
            throw new ArgumentNullException("User");

        var message = added
            ? $"Hey {username}, You now have {role} role."
            : $"Hey {username}, You were removed from the {role} role.";

        _context.Notifications.Add(new Notification
        {
            UserId = user.Id,
            User = user,
            Username = username,
            Message = message,
            Timestamp = DateTime.UtcNow,
            IsRead = false
        });

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"\n\nNotification sent! User: {username} Message: {message}\n\n");
        Console.ResetColor();

        await _context.SaveChangesAsync();
    }
}