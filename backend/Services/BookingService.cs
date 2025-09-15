using System;
using backend.Data;
using backend.Models;
using backend.Repositories;
using backend.Models.DTOs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using backend.Hubs;

namespace backend.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _repository;
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<BookingHub> _hubContext;

        public BookingService(
            IBookingRepository repository,
            ApplicationDbContext context,
            IHubContext<BookingHub> hubContext)
        {
            _repository = repository;
            _context = context;
            _hubContext = hubContext;
        }

        public async Task<IEnumerable<Booking>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }
        public async Task<IEnumerable<Booking>> GetBookingsForUserAsync(string userId)
        {
            return await _repository.GetByUserIdAsync(userId, includeInactive: true);
        }

        public async Task<Booking?> GetByIdAsync(int BookingId)
        {
            return await _repository.GetByIdAsync(BookingId);
        }

        public async Task<Booking> CreateAsync(string UserId, BookingDTO dto)
        {
            // Hämta resursen
            var resource = await _context.Resources.FindAsync(dto.ResourceId);
            if (resource == null)
                throw new Exception("Resource not found");

            if (resource.IsBooked)
                throw new Exception("Resource already booked");

            // Markera resursen som bokad
            resource.IsBooked = true;

            var booking = new Booking
            {
                IsActive = true,
                BookingDate = dto.BookingDate,
                EndDate = dto.EndDate,
                UserId = UserId,
                ResourceId = dto.ResourceId
            };

            var created = await _repository.CreateAsync(booking);

            // Spara ändringar för resurs
            await _context.SaveChangesAsync();

            // Skicka SignalR-event
            await _hubContext.Clients.All.SendAsync("ResourceUpdated", resource);
            await _hubContext.Clients.All.SendAsync("BookingCreated", created);

            return created;
        }

        public async Task<Booking?> UpdateAsync(Booking booking)
        {
            var updated = await _repository.UpdateAsync(booking);
            if (updated != null)
            {
                await _hubContext.Clients.All.SendAsync("BookingUpdated", updated);
            }
            return updated;
        }

        public async Task<string> CancelBookingAsync(int BookingId)
        {
            var booking = await _repository.GetByIdAsync(BookingId);
            if (booking == null) return "BookingNotFound";

            // Markera resursen som ledig igen
            var resource = await _context.Resources.FindAsync(booking.ResourceId);
            if (resource != null)
            {
                resource.IsBooked = false;
            }

            var result = await _repository.CancelBookingAsync(BookingId);
            await _context.SaveChangesAsync();

            // Skicka SignalR-event
            if (resource != null)
                await _hubContext.Clients.All.SendAsync("ResourceUpdated", resource);

            await _hubContext.Clients.All.SendAsync("BookingCancelled", booking.BookingId);

            return result;
        }

        public async Task<bool> DeleteAsync(int BookingId)
        {
            var booking = await _repository.GetByIdAsync(BookingId);
            if (booking == null) return false;

            // Om bokningen fortfarande är aktiv, frigör resursen
            var resource = await _context.Resources.FindAsync(booking.ResourceId);
            if (resource != null)
            {
                resource.IsBooked = false;
            }

            var result = await _repository.DeleteAsync(BookingId);
            await _context.SaveChangesAsync();

            // Skicka SignalR-event
            if (resource != null)
                await _hubContext.Clients.All.SendAsync("ResourceUpdated", resource);

            await _hubContext.Clients.All.SendAsync("BookingDeleted", BookingId);

            return result;
        }
    }
}
