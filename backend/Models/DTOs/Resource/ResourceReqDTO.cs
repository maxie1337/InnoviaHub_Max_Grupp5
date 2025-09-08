using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs.Resource
{
    public class ResourceReqDTO
    {
        [Required]
        public int ResourceTypeId { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; } = null!;
    }
}
