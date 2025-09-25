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
            var now = DateTime.UtcNow;
            query = query.Where(b => b.EndDate > now);
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
            var currentTime = DateTime.UtcNow;
            query = query.Where(b => currentTime < b.EndDate);
        }

        return await query.ToListAsync();
    }

    public async Task<BookingResponseDTO> CreateAsync(Booking booking)
    {
        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();


        // Load related resource
        var resource = await _context.Resources
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.ResourceId == booking.ResourceId);

        return new BookingResponseDTO
        {
            BookingId = booking.BookingId,
            BookingDate = booking.BookingDate,
            EndDate = booking.EndDate,
            Timeslot = booking.Timeslot,
            IsActive = booking.IsActive,
            ResourceId = booking.ResourceId,
            ResourceName = resource?.Name ?? ""
        };
    }

    public async Task<Booking> UpdateAsync(Booking booking)
    {
        _context.Entry(booking).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return booking;
    }

    public async Task<Booking?> CancelBookingAsync(string userId, bool isAdmin, int bookingId)
{
    var booking = await _context.Bookings
        .Include(b => b.Resource)
        .FirstOrDefaultAsync(b => b.BookingId == bookingId);

    if (booking == null) return null;

    var currentTime = DateTime.UtcNow;
    if (!isAdmin && booking.UserId != userId) return null;
    if (currentTime > booking.EndDate) return null;

    booking.IsActive = false;
    await _context.SaveChangesAsync();
    await _hubContext.Clients.All.SendAsync("BookingCancelled", booking);
    return booking;
}

    public async Task<Booking?> DeleteAsync(int bookingId)
    {
        var booking = await _context.Bookings
            .Include(b => b.Resource)
            .FirstOrDefaultAsync(b => b.BookingId == bookingId);

        if (booking == null) return null;

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync("BookingDeleted", booking);

        return booking;
    }
}
