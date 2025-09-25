namespace backend.Models.DTOs
{
    public class BookingResponseDTO
    {
        public int BookingId { get; set; }
        public DateTime BookingDate { get; set; }
        public string Timeslot { get; set; } = default!;
        public bool IsActive { get; set; }
        public int ResourceId { get; set; }
        public string ResourceName { get; set; } = default!;
    }
}
