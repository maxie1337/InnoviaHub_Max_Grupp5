using System;
using backend.Models;
using backend.Models.DTOs;

namespace backend.Services;

public interface IBookingService
{
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<Booking> GetByIdAsync(int BookingId);
    Task<IEnumerable<Booking>> GetMyBookingsAsync(string UserId, bool includeExpiredBookings);
    Task<IEnumerable<GetResourceBookingsDTO>> GetResourceBookingsAsync(int resourceId, bool includeExpiredBookings);
    Task<Booking> CreateAsync(string UserId, BookingDTO dto);
    Task<Booking> UpdateAsync(Booking booking);
    Task<Booking?> CancelBookingAsync(string UserId, bool isAdmin, int BookingId);
    Task<Booking?> DeleteAsync(int BookingId);
    Task<Dictionary<string, List<string>>> GetAvailableResourcesByDateAsync(DateTime date, string? filter = null);

    Task<IEnumerable<string>> GetAvailableTimesAsync(int resourceId, DateTime date);
}
