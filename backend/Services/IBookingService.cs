using System;
using backend.Models;
using backend.Models.DTOs;

namespace backend.Services;

public interface IBookingService
{
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<Booking?> GetByIdAsync(int BookingId);
    Task<Booking> CreateAsync(string UserId, BookingDTO dto);
    Task<Booking?> UpdateAsync(Booking booking);
    Task<string> CancelBookingAsync(int BookingId);
    Task<bool> DeleteAsync(int BookingId);
    Task<IEnumerable<Booking>> GetBookingsForUserAsync(string userId);
}
