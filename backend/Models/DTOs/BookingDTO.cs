namespace backend.Models.DTOs
{
    public class BookingDTO
    {
        public int ResourceId { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}