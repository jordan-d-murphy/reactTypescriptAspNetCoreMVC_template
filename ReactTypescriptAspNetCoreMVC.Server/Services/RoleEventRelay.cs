using ReactTypescriptAspNetCoreMVC.Server.Events;
using ReactTypescriptAspNetCoreMVC.Server.Interfaces;

namespace ReactTypescriptAspNetCoreMVC.Server.Services
{
    public class RoleEventRelay : IRoleEventRelay
    {
        private readonly IServiceProvider _provider;

        public RoleEventRelay(IServiceProvider provider)
        {
            _provider = provider;
        }

        public void Register()
        {
            RoleEvents.OnRoleChanged += async (username, role, added) =>
            {
                using var scope = _provider.CreateScope();
                var handler = scope.ServiceProvider.GetRequiredService<RoleChangedEventHandler>();
                await handler.HandleRoleChange(username, role, added);
            };
            RoleEvents.OnNotifyAll += async (message) =>
            {
                using var scope = _provider.CreateScope();
                var handler = scope.ServiceProvider.GetRequiredService<RoleChangedEventHandler>();
                await handler.HandleNotifyAll(message);
            };
        }
    }
}
