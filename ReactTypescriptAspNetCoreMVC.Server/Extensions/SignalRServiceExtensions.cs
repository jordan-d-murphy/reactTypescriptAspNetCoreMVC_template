using Microsoft.Extensions.DependencyInjection;

namespace Extensions
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