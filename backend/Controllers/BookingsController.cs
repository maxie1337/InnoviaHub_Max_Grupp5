using System.Security.Claims;
using backend.Models;
using backend.Services;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _service;

        private readonly IHubContext<BookingHub> _hubContext;

        public BookingsController(IBookingService service, IHubContext<BookingHub> hubContext)
        {
            _service = service;
            _hubContext = hubContext;
        }

        [Authorize(Roles = "Admin, Member")]
        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var bookings = await _service.GetAllAsync();
            return Ok(bookings);
        }

        [Authorize(Roles = "Admin, Member")]
        [HttpGet("{BookingId}")]
        public async Task<ActionResult> GetById(int BookingId)
        {
            var result = await _service.GetByIdAsync(BookingId);
            if (result == null)
            {
                return NotFound();
            }
            else if (!User.IsInRole("Admin") && result.UserId != User.FindFirstValue(ClaimTypes.NameIdentifier))
            {
                return Unauthorized("Bokningen tillhör en annan användare.");
            }
            else
            {
                return Ok(result);
            }
        }

        [Authorize(Roles = "Admin, Member")]
        [HttpGet("myBookings")]
        public async Task<ActionResult> GetMyBookings(bool includeExpiredBookings = false)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            Console.WriteLine($"JWT userId: {userId}");
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _service.GetMyBookingsAsync(userId, includeExpiredBookings);
            return Ok(result);
        }

        [Authorize(Roles = "Admin, Member")]
        [HttpGet("getByResource/{resourceId}")]
        public async Task<ActionResult> GetResourceBookings(int resourceId, bool includeExpiredBookings = false)
        {
            var result = await _service.GetResourceBookingsAsync(resourceId, includeExpiredBookings);

            return Ok(result);
        }

        [Authorize(Roles = "Admin, Member")]
        [HttpPost]
        public async Task<ActionResult> Create(BookingDTO dto)
        {
            if (dto == null)
                return BadRequest("Booking data is required.");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not found or not logged in.");
            }
            
            var created = await _service.CreateAsync(userId, dto);

            // project entity → DTO
            var response = new BookingResponseDTO
            {
                BookingId = created.BookingId,
                BookingDate = created.BookingDate,
                Timeslot = created.Timeslot,
                IsActive = created.IsActive,
                ResourceId = created.ResourceId,
                ResourceName = created.Resource?.Name ?? ""
            };

            return CreatedAtAction(nameof(GetById), new { BookingId = created.BookingId }, response);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Booking booking)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateAsync(booking);

            return updated == null ? NotFound() : Ok(updated);
        }

        [Authorize(Roles = "Admin, Member")]
        [HttpPost("cancel/{bookingId}")]
        public async Task<ActionResult> CancelBooking(int bookingId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");

            var booking = await _service.CancelBookingAsync(userId, isAdmin, bookingId);

            if (booking == null) return NotFound("BookingNotFound");

            return Ok(booking);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("delete/{bookingId}")]
        public async Task<ActionResult> Delete(int bookingId)
        {
            var booking = await _service.DeleteAsync(bookingId);

            if (booking == null) return NotFound("BookingNotFound");

            return Ok(booking);
        }
    }
}