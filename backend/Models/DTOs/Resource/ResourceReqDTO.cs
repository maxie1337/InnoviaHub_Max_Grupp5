using System.Text.Json.Serialization;

namespace backend.Models.DTOs.Resource
{
    public class ResourceReqDTO
    {
        [JsonConverter(typeof(JsonStringEnumConverter))] // Serializes enum as string in JSON
        public ResourceType Type { get; set; }
    }
}
