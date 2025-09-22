using System;
using backend.Data;
using backend.Models;
using backend.Repositories;
using backend.Models.DTOs;
using Microsoft.AspNetCore.SignalR;
using backend.Hubs;
using backend.Models.DTOs.Resource;

namespace backend.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _repository;
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<BookingHub> _hubContext;
        private readonly IResourceService _resourceService;

        public BookingService(
            IBookingRepository repository,
            ApplicationDbContext context,
            IHubContext<BookingHub> hubContext,
            IResourceService resourceService)
        {
            _repository = repository;
            _context = context;
            _hubContext = hubContext;
            _resourceService = resourceService;
        }

        public async Task<IEnumerable<Booking>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Booking> GetByIdAsync(int BookingId)
        {
            return await _repository.GetByIdAsync(BookingId);
        }

        public async Task<IEnumerable<Booking>> GetMyBookingsAsync(string UserId, bool includeExpiredBookings)
        {
            return await _repository.GetMyBookingsAsync(UserId, includeExpiredBookings);
        }

        public async Task<IEnumerable<GetResourceBookingsDTO>> GetResourceBookingsAsync(int resourceId, bool includeExpiredBookings)
        {
            return await _repository.GetResourceBookingsAsync(resourceId, includeExpiredBookings);
        }

        public async Task<Booking> CreateAsync(string UserId, BookingDTO dto)
        {
            var resource = await _resourceService.GetByIdAsync(dto.ResourceId);
            if (resource == null)
            {
                throw new Exception("ResourceDoesntExist");
            }
            if (dto.Timeslot != "FM" && dto.Timeslot != "EF")
            {
                throw new Exception("NoTimeslotSpecified");
            }

            DateTime bDate = dto.BookingDate;
            var booking = new Booking
            {
                IsActive = true,
                BookingDate = dto.Timeslot == "FM" ? new DateTime(bDate.Year, bDate.Month, bDate.Day, 8, 0, 0) : new DateTime(bDate.Year, bDate.Month, bDate.Day, 12, 0, 0),
                EndDate = dto.Timeslot == "FM" ? new DateTime(bDate.Year, bDate.Month, bDate.Day, 12, 0, 0) : new DateTime(bDate.Year, bDate.Month, bDate.Day, 16, 0, 0),
                UserId = UserId,
                ResourceId = dto.ResourceId
            };

            var created = await _repository.CreateAsync(booking);

            await _hubContext.Clients.All.SendAsync("BookingCreated", created);

            return created;
        }

        public async Task<Booking> UpdateAsync(Booking booking)
        {
            var updated = await _repository.UpdateAsync(booking);
            if (updated != null)
            {
                await _hubContext.Clients.All.SendAsync("BookingUpdated", updated);
            }
            return updated;
        }

        public async Task<string> CancelBookingAsync(string UserId, bool isAdmin, int BookingId)
        {
            var result = await _repository.CancelBookingAsync(UserId, isAdmin, BookingId);
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
