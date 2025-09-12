using System;
using backend.Models;

namespace backend.Repositories;

public interface IBookingRepository
{
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<Booking> GetByIdAsync(int BookingId);
    //Task<IEnumerable<Booking>> GetUserBookingsAsync(string id);
    Task<Booking> CreateAsync(Booking booking);
    Task<Booking> UpdateAsync(Booking booking);
    Task<string> CancelBookingAsync(string UserId, bool isAdmin, int BookingId);
    Task<bool> DeleteAsync(int BookingId);
}
