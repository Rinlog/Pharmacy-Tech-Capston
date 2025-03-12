namespace PharmPracticumBackend.Authentication
{
    public class ApiKeyMiddleWare
    {
        private readonly RequestDelegate _next;
        private readonly AuthConstants _authConstants;

        public ApiKeyMiddleWare(RequestDelegate next, AuthConstants auth)
        {
            _next = next;
            _authConstants = auth;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            
            //checks if header has an api key provided
            if (!(context.Request.Headers.TryGetValue(_authConstants.header, out var ExtractedApiKey))){
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("API key not found");
                return;
            }

            //checks if key they provided is valid
            if (!(_authConstants.key.Equals(ExtractedApiKey)))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("Invalid API key");
                return;
            }

            //if key was provided, and it is valid allow access.
            await _next(context);
        }
    }
}
