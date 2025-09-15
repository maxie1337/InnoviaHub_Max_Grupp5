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
using Microsoft.Extensions.Configuration.UserSecrets;

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

        [Authorize(Roles = "Admin")]
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
        public async Task<ActionResult> GetMyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _service.GetMyBookingsAsync(userId);
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

            var created = await _service.CreateAsync(userId, dto);
            await _hubContext.Clients.All.SendAsync("Booking Created", created);

            return Ok(created);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Booking booking)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateAsync(booking);

            await _hubContext.Clients.All.SendAsync("Booking Updated", updated);
            return updated == null ? NotFound() : Ok(updated);
        }

        [Authorize(Roles = "Admin, Member")]
        [HttpPost("cancel/{BookingId}")]
        public async Task<ActionResult> CancelBooking(int BookingId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = User.IsInRole("Admin");
            var result = await _service.CancelBookingAsync(userId, isAdmin, BookingId);

            if (result == "BookingNotFound")
            {
                return NotFound(result);
            }
            else if (result == "BookingHasExpired" || result == "BookingBelongsToOtherUser")
            {
                return Conflict(result);
            }
            else
            {
                await _hubContext.Clients.All.SendAsync("Booking Cancelled", result);
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
                await _hubContext.Clients.All.SendAsync("Booking Deleted", true);
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }
    }
}