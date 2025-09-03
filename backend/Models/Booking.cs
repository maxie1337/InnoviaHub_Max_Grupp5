using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Booking
{
    public int BookingId { get; set; }
    public required string Status { get; set; } //booked, cancelled, expired
    public DateTime BookingDate { get; set; }
    public DateTime EndDate { get; set; }

    [ForeignKey("UserId")]
    public required AppUser User { get; set; }
    public int UserId { get; set; }

    [ForeignKey("ResourceId")]
    public required Resource Resource { get; set; }
    public int ResourceId { get; set; }
}
