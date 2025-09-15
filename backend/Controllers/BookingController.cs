using System.Security.Claims;
using backend.Models;
using backend.Services;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using backend.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _service;

        private readonly IHubContext<BookingHub> _hubContext;

        public BookingController(IBookingService service, IHubContext<BookingHub> hubContext)
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

        [HttpGet("my")]
        [Authorize(Roles = "Admin, Member")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var bookings = await _service.GetBookingsForUserAsync(userId);
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
            else
            {
                return Ok(result);
            }
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

            return Ok(created);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Booking booking)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateAsync(booking);

            return updated == null ? NotFound() : Ok(updated);
        }

        [Authorize(Roles = "Admin, Member")]
        [HttpPost("cancel/{BookingId}")]
        public async Task<ActionResult> CancelBooking(int BookingId)
        {
            var result = await _service.CancelBookingAsync(BookingId);

            if (result == "BookingNotFound")
            {
                return NotFound(result);
            }
            else if (result == "BookingHasExpired")
            {
                return Conflict(result);
            }
            else
            {
                return Ok(result);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("delete/{BookingId}")]
        public async Task<ActionResult> Delete(int BookingId)
        {
            var result = await _service.DeleteAsync(BookingId);
            if (result == true)
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }
    }
}