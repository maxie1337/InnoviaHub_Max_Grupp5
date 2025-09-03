using System;
using Microsoft.AspNetCore.Identity;

namespace backend.Models;

public class AppUser : IdentityUser
{
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
