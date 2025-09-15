using System;
using backend.Models;

namespace backend.Repositories;

public interface IBookingRepository
{
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<Booking> GetByIdAsync(int BookingId);
    Task<IEnumerable<Booking>> GetMyBookingsAsync(string UserId);
    Task<Booking> CreateAsync(Booking booking);
    Task<Booking> UpdateAsync(Booking booking);
    Task<string> CancelBookingAsync(string UserId, bool isAdmin, int BookingId);
    Task<bool> DeleteAsync(int BookingId);
    Task<IEnumerable<Booking>> GetByUserIdAsync(string userId, bool includeInactive = true);
}
