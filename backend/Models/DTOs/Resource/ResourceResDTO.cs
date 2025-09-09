namespace backend.Models.DTOs.Resource
{
    public class ResourceResDTO
    {
        public int ResourceId { get; set; }
        public int ResourceTypeId { get; set; }
        public string? ResourceTypeName { get; set; }
        public string Name { get; set; } = null!;
        public bool IsBooked { get; set; }
    }
}
