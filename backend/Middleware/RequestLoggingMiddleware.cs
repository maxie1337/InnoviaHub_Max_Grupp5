using System.Diagnostics;
using System.Text;

namespace backend.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;

        public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();
            var requestId = Guid.NewGuid().ToString("N")[..8];
            
            // Log request
            var request = await FormatRequest(context.Request, requestId);
            _logger.LogInformation("Request {RequestId}: {Request}", requestId, request);

            // Capture response
            var originalResponseBodyStream = context.Response.Body;
            using var responseBodyStream = new MemoryStream();
            context.Response.Body = responseBodyStream;

            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Request {RequestId} failed with exception", requestId);
                throw;
            }
            finally
            {
                stopwatch.Stop();

                // Log response
                var response = await FormatResponse(context.Response, requestId, stopwatch.ElapsedMilliseconds);
                _logger.LogInformation("Response {RequestId}: {Response}", requestId, response);

                // Copy response back to original stream
                await responseBodyStream.CopyToAsync(originalResponseBodyStream);
                context.Response.Body = originalResponseBodyStream;
            }
        }

        private static async Task<string> FormatRequest(HttpRequest request, string requestId)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Request {requestId}:");
            sb.AppendLine($"  Method: {request.Method}");
            sb.AppendLine($"  Path: {request.Path}");
            sb.AppendLine($"  QueryString: {request.QueryString}");
            sb.AppendLine($"  Headers: {string.Join(", ", request.Headers.Select(h => $"{h.Key}={h.Value}"))}");

            if (request.ContentLength > 0)
            {
                request.EnableBuffering();
                var buffer = new byte[Convert.ToInt32(request.ContentLength)];
                await request.Body.ReadAsync(buffer, 0, buffer.Length);
                var bodyAsText = Encoding.UTF8.GetString(buffer);
                sb.AppendLine($"  Body: {bodyAsText}");
                request.Body.Position = 0;
            }

            return sb.ToString();
        }

        private static async Task<string> FormatResponse(HttpResponse response, string requestId, long elapsedMs)
        {
            var sb = new StringBuilder();
            sb.AppendLine($"Response {requestId}:");
            sb.AppendLine($"  StatusCode: {response.StatusCode}");
            sb.AppendLine($"  ContentType: {response.ContentType}");
            sb.AppendLine($"  ElapsedMs: {elapsedMs}");

            if (response.Body.Length > 0)
            {
                response.Body.Seek(0, SeekOrigin.Begin);
                var text = await new StreamReader(response.Body).ReadToEndAsync();
                response.Body.Seek(0, SeekOrigin.Begin);
                sb.AppendLine($"  Body: {text}");
            }

            return sb.ToString();
        }
    }
}




