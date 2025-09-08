using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Booking
{
    public int BookingId { get; set; }
    public required bool IsActive { get; set; }
    public DateTime BookingDate { get; set; }
    public DateTime EndDate { get; set; }

    [ForeignKey("UserId")]
    public required ApplicationUser User { get; set; }
    public string UserId { get; set; } = string.Empty;

    [ForeignKey("ResourceId")]
    public required Resource Resource { get; set; }
    public int ResourceId { get; set; }
}
