using System;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly ApplicationDbContext _context;

    public BookingRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await _context.Bookings.ToListAsync();
    }

    /*public async Task<IEnumerable<Booking>> GetUserBookingsAsync(string UserId)
    {
    
    }*/

    public async Task<Booking> CreateAsync(Booking booking)
    {
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();
        return booking;
    }

    public async Task<Booking> UpdateAsync(Booking booking)
    {
        _context.Entry(booking).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return booking;
    }

    public async Task<bool> CancelBookingAsync(int id)
    {
        var booking = _context.Bookings.FirstOrDefault(b => b.BookingId == id);
        if (booking == null)
        {
            return false;
        }

        booking.IsActive = false;
        await _context.SaveChangesAsync();

        return true;
    }
    
    public async Task<bool> DeleteAsync(int id)
    {
        var booking = await _context.Bookings.FindAsync(id);
        if (booking != null)
        {
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return true;
        }
        else
            return false;
    }
}
