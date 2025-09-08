using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class ResourceType
    {
        public int ResourceTypeId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public ICollection<Resource> Resources { get; set; } = new List<Resource>();
    }
}
