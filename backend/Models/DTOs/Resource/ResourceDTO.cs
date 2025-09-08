namespace backend.Models.DTOs.Resource
{
    public class ResourceDTO
    {
        public int? ResourceTypeId { get; set; }
        public string? Name { get; set; }
        public bool? IsBooked { get; set; }

    }
}