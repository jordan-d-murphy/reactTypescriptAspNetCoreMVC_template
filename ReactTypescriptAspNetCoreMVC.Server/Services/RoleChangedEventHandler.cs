using ReactTypescriptAspNetCoreMVC.Server.Interfaces;

namespace ReactTypescriptAspNetCoreMVC.Server.Services
{

    public class RoleChangedEventHandler
    {
        private readonly INotificationService _notificationService;

        public RoleChangedEventHandler(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        public async Task HandleRoleChange(string username, string role, bool added)
        {
            Console.WriteLine($"[SignalR] Sending notification to user: {username} role: {role} added: {added}");
            await _notificationService.SendNotificationAsync(username, role, added);
        }

        public async Task HandleNotifyAll(string message)
        {
            Console.WriteLine($"[SignalR] Sending notification to all: {message}");
            await _notificationService.SendNotifyAllAsync(message);
        }
    }
}
