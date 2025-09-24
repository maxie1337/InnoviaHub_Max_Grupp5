using System;
using System.Globalization;
using Microsoft.EntityFrameworkCore;
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
            if (resource == null) throw new Exception("ResourceDoesntExist");
            if (dto.Timeslot != "FM" && dto.Timeslot != "EF") throw new Exception("NoTimeslotSpecified");
            if (string.IsNullOrWhiteSpace(dto.BookingDate)) throw new Exception("InvalidDate");

            var tz = TimeZoneInfo.FindSystemTimeZoneById("Europe/Stockholm");

            if (!DateTime.TryParseExact(dto.BookingDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var dateOnly))
            {
                throw new Exception("InvalidDateFormat");
            }

            var nowSthlm = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
            if (dateOnly.Date < nowSthlm.Date) throw new Exception("DateInPast");

            var startLocal = dto.Timeslot == "FM" ? dateOnly.Date.AddHours(8) : dateOnly.Date.AddHours(12);
            var endLocal   = dto.Timeslot == "FM" ? dateOnly.Date.AddHours(12) : dateOnly.Date.AddHours(16);

            if (dateOnly.Date == nowSthlm.Date)
            {
                if (dto.Timeslot == "FM" && nowSthlm.TimeOfDay >= new TimeSpan(12, 0, 0))
                    throw new Exception("TimeslotAlreadyPassed");
                if (dto.Timeslot == "EF" && nowSthlm.TimeOfDay >= new TimeSpan(16, 0, 0))
                    throw new Exception("TimeslotAlreadyPassed");
            }

            var startUtc = TimeZoneInfo.ConvertTimeToUtc(startLocal, tz);
            var endUtc   = TimeZoneInfo.ConvertTimeToUtc(endLocal, tz);

            var conflict = await _context.Bookings.AnyAsync(b =>
                b.ResourceId == dto.ResourceId &&
                b.IsActive &&
                b.BookingDate == startUtc &&
                b.EndDate == endUtc
            );
            if (conflict) throw new Exception("TimeslotAlreadyBooked");


            var booking = new Booking
            {
                IsActive = true,
                BookingDate = startUtc,
                EndDate = endUtc,
                UserId = UserId,
                ResourceId = dto.ResourceId,
                Timeslot = dto.Timeslot
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

        public async Task<Booking?> CancelBookingAsync(string userId, bool isAdmin, int bookingId)
        {
            var booking = await _repository.CancelBookingAsync(userId, isAdmin, bookingId);
            if (booking != null)
            {
                await _hubContext.Clients.All.SendAsync("BookingCancelled", booking);
            }
            return booking;
        }
        public async Task<Booking?> DeleteAsync(int bookingId)
        {
            var booking = await _repository.DeleteAsync(bookingId);
            if (booking != null)
            {
                var resource = await _context.Resources.FindAsync(booking.ResourceId);
                if (resource != null)
                {
                    resource.IsBooked = false;
                    await _hubContext.Clients.All.SendAsync("ResourceUpdated", resource);
                }

                await _hubContext.Clients.All.SendAsync("BookingDeleted", booking);
            }
            return booking;
        }
    }
}
