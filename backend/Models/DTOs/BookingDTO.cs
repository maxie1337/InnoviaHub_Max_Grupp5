using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs
{
    public class BookingDTO
    {
        [Required]
        public int ResourceId { get; set; }

        [Required]
        public string BookingDate { get; set; } = default!;

        [Required]
        public string Timeslot { get; set; } = default!;
    }
}