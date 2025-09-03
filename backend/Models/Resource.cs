using System.ComponentModel.DataAnnotations;

namespace InnoviaHub_Grupp5.Models
{
    public class Resources
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Type { get; set; }

        [Required]
        public string Status { get; set; }
    }
}