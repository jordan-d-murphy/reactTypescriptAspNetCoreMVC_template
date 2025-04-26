using Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using static AdminController;

public class NotificationService : INotificationService
{
    private readonly AuthDbContext _context;
    private readonly UserManager<AppUser> _userManager;
    private readonly IHubContext<NotificationHub> _hub;



    public NotificationService(AuthDbContext context, UserManager<AppUser> userManager, IHubContext<NotificationHub> hub)
    {
        _context = context;
        _userManager = userManager;
        _hub = hub;
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

        await _hub.Clients.User(user.Id).SendAsync("ReceiveNotification", message);

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"\n\nNotification sent! User: {username} Message: {message}\n\n");
        Console.ResetColor();

        await _context.SaveChangesAsync();
    }

    public async Task SendNotifyAllAsync(string message)
    {
        var users = await _userManager.Users.ToListAsync();

        foreach (var user in users)
        {
            if (user is not null && user.UserName is not null)
            {
                _context.Notifications.Add(new Notification
                {
                    UserId = user.Id,
                    User = user,
                    Username = user.UserName,
                    Message = message,
                    Timestamp = DateTime.UtcNow,
                    IsRead = false
                });
            }
            else
            {
                Console.WriteLine($"\n\nUnable to send notification to user: {user} Undeliverable Message: {message}\n\n");
            }
        }

        await _hub.Clients.All.SendAsync("ReceiveNotification", message = $"[All Users] {message}");

        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"\n\nNotification sent to all users! Message: {message}\n\n");
        Console.ResetColor();

        await _context.SaveChangesAsync();
    }
}
