using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using InnoviaHub_Grupp5.Services;
using InnoviaHub_Grupp5.Models.DTOs;


namespace backend.Controllers
{
    /*[ApiController]
    [Route("api/[controller]")]
    public class ResourceController : ControllerBase
    {
        private readonly IResourceService _service;
        public ResourceController(IResourceService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var resource = await _service.GetByIdAsync(id);
            return resource == null ? NotFound() : Ok(resource);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ResourceDTO dto)
        {
            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ResourceDTO dto)
        {
            var updated = await _service.UpdateAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id) =>
            await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }*/







    [ApiController]
    [Route("api/[controller]")]
    public class ResourcesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResourcesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/resources
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resource>>> GetAll()
        {
            return await _context.Resources.ToListAsync();
        }

        // GET: api/resources/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Resource>> GetById(int id)
        {
            var resource = await _context.Resources.FindAsync(id);

            if (resource == null)
                return NotFound();

            return resource;
        }

        // POST: api/resources
        [HttpPost]
        public async Task<ActionResult<Resource>> Create(Resource resource)
        {
            _context.Resources.Add(resource);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = resource.ResourceId }, resource);
        }

        // PUT: api/resources/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Resource updatedResource)
        {
            if (id != updatedResource.ResourceId)
                return BadRequest();

            _context.Entry(updatedResource).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await ResourceExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/resources/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var resource = await _context.Resources.FindAsync(id);
            if (resource == null)
                return NotFound();

            _context.Resources.Remove(resource);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> ResourceExists(int id)
        {
            return await _context.Resources.AnyAsync(e => e.ResourceId == id);
        }
    }
}
