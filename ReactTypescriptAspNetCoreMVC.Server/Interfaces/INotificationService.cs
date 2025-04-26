public interface INotificationService
{
    Task SendNotificationAsync(string username, string role, bool added);

    Task SendNotifyAllAsync(string message);
}
