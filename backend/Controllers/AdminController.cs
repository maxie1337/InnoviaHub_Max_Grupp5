using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using backend.DTOs;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtTokenManager _jwtTokenManager;

        public AdminController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IJwtTokenManager jwtTokenManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwtTokenManager = jwtTokenManager;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.FirstName,
                    u.LastName,
                    u.Role,
                    u.IsActive,
                    u.CreatedAt,
                    u.UpdatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FirstName,
                user.LastName,
                user.Role,
                user.IsActive,
                user.CreatedAt,
                user.UpdatedAt,
                roles = roles.ToList()
            });
        }

        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> UpdateUserRole(string id, [FromBody] UpdateRoleDto updateRoleDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            // Check if role exists
            var roleExists = await _roleManager.RoleExistsAsync(updateRoleDto.Role);
            if (!roleExists)
                return BadRequest("Role does not exist");

            // Remove current roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }

            // Add new role
            await _userManager.AddToRoleAsync(user, updateRoleDto.Role);

            // Update user role
            user.Role = updateRoleDto.Role;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new
            {
                message = "User role updated successfully",
                user = new
                {
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.Role,
                    user.IsActive,
                    user.UpdatedAt
                }
            });
        }

        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(string id, [FromBody] UpdateStatusDto updateStatusDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            user.IsActive = updateStatusDto.IsActive;
            user.UpdatedAt = DateTime.UtcNow;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new
            {
                message = "User status updated successfully",
                user = new
                {
                    user.Id,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    user.Role,
                    user.IsActive,
                    user.UpdatedAt
                }
            });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound("User not found");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleManager.Roles
                .Select(r => new { r.Id, r.Name })
                .ToListAsync();

            return Ok(roles);
        }

        [HttpPost("roles")]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto createRoleDto)
        {
            if (await _roleManager.RoleExistsAsync(createRoleDto.Name))
                return BadRequest("Role already exists");

            var role = new IdentityRole(createRoleDto.Name);
            var result = await _roleManager.CreateAsync(role);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new
            {
                message = "Role created successfully",
                role = new { role.Id, role.Name }
            });
        }
    }
}
