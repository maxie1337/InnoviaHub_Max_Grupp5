using System.ComponentModel.DataAnnotations;

namespace InnoviaHub_Grupp5.Models
{
    public class Booking
    {
        [Required]
        public int Id { get; set; }        

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        public string Status { get; set; }

        [Required]
        public int ResourceId { get; set; }


        [Required]
        public string UserId { get; set; }

        
    }
}