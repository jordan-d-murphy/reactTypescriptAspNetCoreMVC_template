using static AdminController;

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
    }
}
