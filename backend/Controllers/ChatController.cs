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

        // Stremamer för svar till frontend, Server sent events heter det
        [HttpPost("stream")]
        public async Task StreamChat([FromBody] ChatRequest request)
        {
            // Http-header för att svaren ska streamas
            Response.ContentType = "text/event-stream";
            Response.Headers["Cache-Control"] = "no-cache";
            Response.Headers["X-Accel-Buffering"] = "no";
            Response.Headers["Connection"] = "keep-alive";
            await Response.Body.FlushAsync();

            try
            {
                // Försöker hitta datum och kategori via frågan från user
                var (date, filter) = ExtractDateAndFilter(request.question);

                // Frågar man om lediga resurser, ska data hämtas från bookingservice
                if (date != null)
                {
                    var resources = await _bookingService.GetAvailableResourcesByDateAsync(date.Value, filter);

                    var category = filter switch
                    {
                        "skrivbord" or "desk" => "skrivbord",
                        "mötesrum" or "meeting" => "mötesrum",
                        "vr" or "headset" => "VR-headsets",
                        "ai" or "server" => "AI-servrar",
                        _ => "resurser"
                    };

                    var list = resources.Keys.ToList();

                    // Datan skickas som JSON till frontenden
                    var json = JsonSerializer.Serialize(new
                    {
                        type = "availability",
                        category,
                        date = date.Value.ToString("yyyy-MM-dd"),
                        resources = list
                    });

                    await Response.WriteAsync($"data: {json}\n\n");
                    await Response.Body.FlushAsync();
                    return;
                }
                // Funkar det inte frågas GPT via OPEN ai för att det ska kännas "levande"
                var http = _httpClientFactory.CreateClient("openai");

                var body = new
                {
                    model = "gpt-4.1",
                    messages = new[]
                    {
                        new {
                            role = "system",
                            content = "Du är assistent för Innovia Hub. Du hjälper användare att boka skrivbord, mötesrum, VR-headsets och AI-servrar. Du är proffesionel, snäll och hjälpsam. Svara alltid på samma språk som användaren."
                        },
                        new { role = "user", content = request.question }
                    },
                    stream = true
                };

                var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
                var response = await http.PostAsync("chat/completions", content, HttpContext.RequestAborted);
                var stream = await response.Content.ReadAsStreamAsync();
                using var reader = new StreamReader(stream);
                var buffer = new StringBuilder();

                // Stremar varje textdel till frontenden så att den ska byggas upp i realtid
                while (!reader.EndOfStream && !HttpContext.RequestAborted.IsCancellationRequested)
                {
                    var line = await reader.ReadLineAsync();
                    if (string.IsNullOrWhiteSpace(line) || !line.StartsWith("data:")) continue;

                    var jsonLine = line.Substring("data:".Length).Trim();
                    if (jsonLine == "[DONE]") break;

                    using var doc = JsonDocument.Parse(jsonLine);
                    var delta = doc.RootElement.GetProperty("choices")[0].GetProperty("delta");

                    // Hämtar texten och skickar till frontend
                    if (delta.TryGetProperty("content", out var contentProp))
                    {
                        var tokenText = contentProp.GetString();
                        if (!string.IsNullOrEmpty(tokenText))
                        {
                            await Response.WriteAsync($"data: {tokenText}\n\n");
                            await Response.Body.FlushAsync();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Fel skickas som JSOn
                Console.WriteLine($"Stream error: {ex.Message}");
                if (!Response.HasStarted)
                {
                    Response.ContentType = "application/json";
                    await Response.WriteAsync(JsonSerializer.Serialize(new { error = ex.Message }));
                }
            }
        }

        // Tolkning av data och resurstyp (skrivbord, fredag t.ex)
        private (DateTime? date, string? filter) ExtractDateAndFilter(string question)
        {
            var lower = question.ToLower();
            var today = DateTime.Today;
            DateTime? date = null;

            // Kan söka med ord som idag, imorgon och förstår vilka dagar man är ute efter
            if (lower.Contains("idag") || lower.Contains("today")) date = today;
            else if (lower.Contains("imorgon") || lower.Contains("tomorrow")) date = today.AddDays(1);
            else
            {
                var days = new Dictionary<string, DayOfWeek>
                {
                    ["måndag"] = DayOfWeek.Monday,
                    ["tisdag"] = DayOfWeek.Tuesday,
                    ["onsdag"] = DayOfWeek.Wednesday,
                    ["torsdag"] = DayOfWeek.Thursday,
                    ["fredag"] = DayOfWeek.Friday,
                    ["lördag"] = DayOfWeek.Saturday,
                    ["söndag"] = DayOfWeek.Sunday
                };

                foreach (var kv in days)
                {
                    if (lower.Contains(kv.Key))
                    {
                        int diff = ((int)kv.Value - (int)today.DayOfWeek + 7) % 7;
                        date = today.AddDays(diff == 0 ? 7 : diff);
                        break;
                    }
                }

                // Matchar datumformat
                if (date == null)
                {
                    var match = System.Text.RegularExpressions.Regex.Match(question, @"\b\d{4}-\d{2}-\d{2}\b");
                    if (match.Success && DateTime.TryParse(match.Value, out var parsed)) date = parsed;
                }
            }

            // Hittar resurstyp med hjälp av dessa sökord
            var filters = new[] { "skrivbord", "desk", "mötesrum", "meeting", "vr", "headset", "ai", "server" };
            var foundFilter = filters.FirstOrDefault(f => lower.Contains(f));

            return (date, foundFilter);
        }
    }
}