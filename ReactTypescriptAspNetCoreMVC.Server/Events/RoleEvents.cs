namespace ReactTypescriptAspNetCoreMVC.Server.Events
{
    public static class RoleEvents
    {
        public static event Action<string, string, bool>? OnRoleChanged;
        public static event Action<string>? OnNotifyAll;

        public static void RaiseRoleChanged(string username, string role, bool added)
        {
            Console.WriteLine($"[RoleEvents] RaiseRoleChanged fired for {username} role: {role} added: {added}");
            if (OnRoleChanged != null)
            {
                OnRoleChanged.Invoke(username, role, added);
            }
        }

        public static void RaiseNotifyAll(string message)
        {
            Console.WriteLine($"[RoleEvents] RaiseNotifyAll fired for all users");
            if (OnNotifyAll != null)
            {
                OnNotifyAll.Invoke(message);
            }
        }
    }
}
