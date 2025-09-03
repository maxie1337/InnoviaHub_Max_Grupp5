using System.ComponentModel.DataAnnotations;

namespace InnoviaHub_Grupp5.Models
{
    public class User
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Role { get; set; }
    }
}