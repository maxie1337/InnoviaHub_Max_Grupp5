using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using System.Globalization;

namespace backend.Controllers
{
    [Route("api/ai/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IBookingService _bookingService;

        public ChatController(IHttpClientFactory httpClientFactory, IBookingService bookingService)
        {
            _httpClientFactory = httpClientFactory;
            _bookingService = bookingService;
        }

        public record ChatRequest(string question);

        // ---------------------------------------------------
        // 📡 Huvudendpoint: Streamar svar tillbaka i realtid
        // POST /api/ai/chat/stream
        // ---------------------------------------------------
        [HttpPost("stream")]
        public async Task StreamChat([FromBody] ChatRequest request)
        {
            Response.ContentType = "text/event-stream";

            // Försök tolka datum och resurstyp från frågan
            var (date, filter) = ExtractDateAndFilter(request.question);

            // 🧠 Om det är en bokningsfråga → svara med backend-data
            if (date != null)
            {
                var resources = await _bookingService.GetAvailableResourcesByDateAsync(date.Value, filter);

                var sb = new StringBuilder();

                if (!resources.Any())
                {
                    sb.AppendLine($"Inga lediga resurser hittades för {date.Value:yyyy-MM-dd}.");
                }
                else
                {
                    sb.AppendLine($"Följande resurser är lediga den {date.Value:yyyy-MM-dd}:");

                    foreach (var res in resources)
                    {
                        var readable = res.Value.Select(slot => slot == "FM" ? "förmiddag" : "eftermiddag");
                        sb.AppendLine($"- {res.Key}: {string.Join(", ", readable)}");
                    }
                }

                // Skicka tillbaka texten som stream
                await Response.WriteAsync($"data: {sb}\n\n");
                await Response.Body.FlushAsync();
                return;
            }

            // 🧠 Annars – fråga OpenAI via stream
            var http = _httpClientFactory.CreateClient("openai");

            var body = new
            {
                model = "gpt-4",
                messages = new[]
                {
                    new { role = "user", content = request.question }
                },
                stream = true
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await http.PostAsync("chat/completions", content, HttpContext.RequestAborted);
            var stream = await response.Content.ReadAsStreamAsync();
            using var reader = new StreamReader(stream);

            while (!reader.EndOfStream && !HttpContext.RequestAborted.IsCancellationRequested)
            {
                var line = await reader.ReadLineAsync();
                if (string.IsNullOrWhiteSpace(line) || !line.StartsWith("data:")) continue;

                var json = line.Substring("data:".Length).Trim();
                if (json == "[DONE]") break;

                using var doc = JsonDocument.Parse(json);
                var text = doc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("delta")
                    .GetProperty("content")
                    .GetString();

                if (!string.IsNullOrEmpty(text))
                {
                    await Response.WriteAsync($"data: {text}\n\n");
                    await Response.Body.FlushAsync();
                }
            }
        }


        private (DateTime? date, string? filter) ExtractDateAndFilter(string question)
        {
            DateTime? parsedDate = null;

            // 1. Matcha ISO-format: yyyy-MM-dd
            var isoMatch = System.Text.RegularExpressions.Regex.Match(question, @"\d{4}-\d{2}-\d{2}");
            if (isoMatch.Success && DateTime.TryParse(isoMatch.Value, out var d1))
            {
                parsedDate = d1;
            }

            // 2. Tolka svensk datumtext (ex. "10 oktober")
            if (parsedDate == null)
            {
                var cleaned = question
                    .Replace("den", "")
                    .Replace("på", "")
                    .Replace("bokning", "")
                    .Replace("tillgänglig", "")
                    .Trim();

                var svCulture = new CultureInfo("sv-SE");
                var formats = new[]
                {
                    "d MMMM",            // 10 oktober
                    "d MMMM yyyy",       // 10 oktober 2025
                    "dd-MM-yyyy",        // 10-10-2025
                    "yyyy-MM-dd",        // ISO
                    "d/M/yyyy"           // 10/10/2025
                };

                foreach (var format in formats)
                {
                    if (DateTime.TryParseExact(cleaned, format, svCulture, DateTimeStyles.None, out var d2))
                    {
                        parsedDate = d2;
                        break;
                    }
                }
            }

            // 3. Leta efter filterord i frågan
            var possibleFilters = new[]
            {
                "skrivbord", "desk",
                "mötesrum", "meeting",
                "vr", "headset",
                "ai", "server"
            };

            string? foundFilter = possibleFilters.FirstOrDefault(f =>
                question.ToLower().Contains(f.ToLower()));

            return (parsedDate, foundFilter);
        }
    }
}
