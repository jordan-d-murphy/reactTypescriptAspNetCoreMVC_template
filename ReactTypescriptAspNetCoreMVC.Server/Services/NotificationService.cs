using Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
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
        // await _hub.Clients.All.SendAsync("ReceiveNotification", new { message = "[All Users] Test notification!" });


        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine($"\n\nNotification sent! User: {username} Message: {message}\n\n");
        Console.ResetColor();

        await _context.SaveChangesAsync();
    }
}