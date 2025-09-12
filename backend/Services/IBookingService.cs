using System;
using backend.Models;
using backend.Models.DTOs;

namespace backend.Services;

public interface IBookingService
{
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<Booking> GetByIdAsync(int BookingId);
    Task<Booking> CreateAsync(string UserId, BookingDTO dto);
    Task<Booking> UpdateAsync(Booking booking);
    Task<string> CancelBookingAsync(string UserId, bool isAdmin, int BookingId);
    Task<bool> DeleteAsync(int BookingId);
}
