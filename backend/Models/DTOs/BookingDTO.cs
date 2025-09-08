namespace InnoviaHub_Grupp5.Models.DTOs
{
    public class BookingDTO
    {
        public string UserId { get; set; } = string.Empty;
        public int ResourceId { get; set; }
        public DateTime BookingDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}