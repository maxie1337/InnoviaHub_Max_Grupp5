using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using InnoviaHub_Grupp5.Services;
using InnoviaHub_Grupp5.Models.DTOs;
using Microsoft.AspNetCore.Authorization;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResourcesController : ControllerBase
    {
        private readonly IResourceService _service;

        public ResourcesController(IResourceService service)
        {
            _service = service;
        }

        // GET: api/resource
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var resources = await _service.GetAllAsync();
            return Ok(resources);
        }

        // GET: api/resource/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var resource = await _service.GetByIdAsync(id);
            return resource == null ? NotFound() : Ok(resource);
        }

        // POST: api/resource
        [HttpPost]
        public async Task<ActionResult> Create(ResourceDTO dto)
        {
            if (dto == null)
                return BadRequest("Resource data is required.");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);


            return CreatedAtAction(nameof(GetById), new { id = created.ResourceId }, created);
        }

        // PUT: api/resource/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ResourceDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateAsync(id, dto);
            return updated == null ? NotFound() : Ok(updated);
        }

        // DELETE: api/resource/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }




/// <summary>
/// /////////////////////////////////////////////////////////////////////////
/// </summary>/


    /*[ApiController]
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
    }*/
}
