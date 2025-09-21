using System;
using backend.Data;
using backend.Hubs;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<BookingHub> _hubContext;

    public BookingRepository(ApplicationDbContext context, IHubContext<BookingHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await _context.Bookings
        .Include(b => b.Resource)
        .ToListAsync();
    }

    public async Task<Booking> GetByIdAsync(int BookingId)
    {
        var result = await _context.Bookings
        .Include(b => b.Resource)
        .FirstOrDefaultAsync(b => b.BookingId == BookingId);
        
        return result;
    }

    public async Task<IEnumerable<Booking>> GetMyBookingsAsync(string UserId, bool includeExpiredBookings = false)
    {
        var query = _context.Bookings
        .Include(b => b.Resource)
        .AsQueryable();

        query = query.Where(b => b.UserId == UserId);

        if (includeExpiredBookings == false)
        {
            var currentTime = DateTime.Now;
            query = query.Where(b => currentTime < b.EndDate);
        }

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<GetResourceBookingsDTO>> GetResourceBookingsAsync(int resourceId, bool includeExpiredBookings = false)
    {
        var query = _context.Bookings
        .Where(b => b.ResourceId == resourceId)
        .Select(b => new GetResourceBookingsDTO { BookingDate = b.BookingDate, EndDate = b.EndDate })
        .AsQueryable();

        if (includeExpiredBookings == false)
        {
            var currentTime = DateTime.Now;
            query = query.Where(b => currentTime < b.EndDate);
        }

        return await query.ToListAsync();
    }

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

    public async Task<string> CancelBookingAsync(string UserId, bool isAdmin, int BookingId)
    {
        var booking = _context.Bookings
        .FirstOrDefault(b => b.BookingId == BookingId);

        var currentTime = DateTime.Now;
        if (booking == null)
        {
            return "BookingNotFound";
        }
        else if (!isAdmin && booking.UserId != UserId)
        {
            return "BookingBelongsToOtherUser";
        }
        else if (currentTime < booking.EndDate)
        {
            return "BookingHasExpired";
        }
        else if (booking.Resource == null)
        {
            return "Error";
        }

        var result = await DeleteAsync(booking.BookingId);
        if (result == true)
        {
            // Skicka SignalR-event
            await _hubContext.Clients.All.SendAsync("BookingCancelled", booking.BookingId);

            return "Success";
        }
        else
        {
            return "Failure";
        }
    }
    
    public async Task<bool> DeleteAsync(int BookingId)
    {
        var booking = await _context.Bookings.FindAsync(BookingId);
        if (booking != null)
        {
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
            return true;
        }
        else
        {
            return false;
        }
    }
}
