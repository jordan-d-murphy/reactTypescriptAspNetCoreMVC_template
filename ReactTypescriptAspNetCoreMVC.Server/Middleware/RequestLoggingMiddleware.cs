namespace ReactTypescriptAspNetCoreMVC.Server.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public RequestLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            // 🔴 Place a breakpoint here to grab any and all incoming requests to the api
            Console.WriteLine($"Incoming request: {context.Request.Method} {context.Request.Path}");
            await _next(context);
        }
    }
}
