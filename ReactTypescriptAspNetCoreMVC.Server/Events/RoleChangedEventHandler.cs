using static AdminController;

public class RoleChangedEventHandler
{
    private readonly INotificationService _notificationService;

    public RoleChangedEventHandler(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task HandleRoleChange(string username, string role, bool added)
    {
        await _notificationService.SendNotificationAsync(username, role, added);
    }
}