namespace ReactTypescriptAspNetCoreMVC.Server.Extensions
{
    public static class SignalRServiceExtensions
    {
        public static IServiceCollection AddSignalRServices(this IServiceCollection services)
        {
            services.AddSignalR()
                    .AddJsonProtocol();

            return services;
        }
    }
}