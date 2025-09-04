
using backend.Models;

namespace InnoviaHub_Grupp5.Models.DTOs
{
    public class ResourceDTO
    {
        public int ResourceId { get; set; }
        public ResourceType Type { get; set; }
        public bool IsBooked { get; set; }

    }
}