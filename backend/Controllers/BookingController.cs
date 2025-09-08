using backend.Models;
using backend.Services;
using InnoviaHub_Grupp5.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        [HttpPost]
        public async Task<ActionResult> GetAll()
        {
            var resources = await _service.GetAllAsync();
            return Ok(resources);
        }

        [HttpPost]
        public async Task<ActionResult> Create(BookingDTO dto)
        {
            if (dto == null)
                return BadRequest("Booking data is required.");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);

            return Ok(created);
            //return CreatedAtAction(nameof(GetById), new { id = created.ResourceId }, created);
        }
    }
}