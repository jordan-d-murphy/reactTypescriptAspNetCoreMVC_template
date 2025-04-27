using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace ReactTypescriptAspNetCoreMVC.Server.Hubs
{
    public class NotificationHub : Hub
    {
        public const string HubUrl = "/hubs/notifications";

        public override Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"\n\n[Hub] Connected user: {userId}\n\n");
            Console.ResetColor();

            // Optional: Add to group by userId
            return base.OnConnectedAsync();
        }
    }
}
