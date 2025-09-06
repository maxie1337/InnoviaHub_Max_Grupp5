using System.Text.Json.Serialization;

namespace backend.Models.DTOs.Resource
{
    public class ResourceResDTO
    {
        public int ResourceId { get; set; }


        [JsonConverter(typeof(JsonStringEnumConverter))] // Serializes enum as string in JSON
        public ResourceType Type { get; set; }

        public bool IsBooked { get; set; }
    }
}
