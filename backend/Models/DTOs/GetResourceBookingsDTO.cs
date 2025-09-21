using System;

namespace backend.Models.DTOs;

public class GetResourceBookingsDTO
{
    public DateTime BookingDate { get; set; }
    public DateTime EndDate { get; set; }
}
