using System;
using backend.Models;
using backend.Models.DTOs;

namespace backend.Repositories;

public interface IBookingRepository
{
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<Booking?> GetByIdAsync(int bookingId);
    Task<IEnumerable<Booking>> GetMyBookingsAsync(string userId, bool includeExpiredBookings = false);
    Task<IEnumerable<GetResourceBookingsDTO>> GetResourceBookingsAsync(int resourceId, bool includeExpiredBookings = false);
    Task<Booking> CreateAsync(Booking booking);
    Task<Booking> UpdateAsync(Booking booking);
    Task<Booking?> CancelBookingAsync(string userId, bool isAdmin, int bookingId);
    Task<Booking?> DeleteAsync(int bookingId);
    Task<IEnumerable<string>> GetAvailableTimesAsync(int resourceId, DateTime date);
}
