using System.Text.Json.Serialization;

namespace backend.Models.DTOs.Resource
{
    public class ResourceDTO
    {

        [JsonConverter(typeof(JsonStringEnumConverter))] // Serializes enum as string in JSON
        public ResourceType? Type { get; set; }

        public bool? IsBooked { get; set; }

    }
}