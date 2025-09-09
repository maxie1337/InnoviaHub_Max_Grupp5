using System.Security.Claims;
using backend.Models;
using backend.Services;
using InnoviaHub_Grupp5.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _service;

        public BookingController(IBookingService service)
        {
            _service = service;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult> GetAll()
        {
            var bookings = await _service.GetAllAsync();
            return Ok(bookings);
        }

        [Authorize(Roles = "Member")]
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

        [Authorize(Roles = "Member")]
        [HttpPost]
        public async Task<ActionResult> Create(BookingDTO dto)
        {
            if (dto == null)
                return BadRequest("Booking data is required.");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
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

        [Authorize(Roles = "Member")]
        [HttpPost]
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
        [HttpPost("{BookingId}")]
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