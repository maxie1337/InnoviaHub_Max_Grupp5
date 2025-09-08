using System;
using backend.Models;

namespace backend.Repositories;

public interface IBookingRepository
{
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<IEnumerable<Booking>> GetUserBookingsAsync(string id);
    Task<Booking> CreateAsync(Booking booking);
    Task<Booking> UpdateAsync(Booking booking);
    Task<bool> CancelBookingAsync(int id);
    Task<bool> DeleteAsync(int id);
}
