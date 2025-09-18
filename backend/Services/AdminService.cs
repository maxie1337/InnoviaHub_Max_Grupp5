using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using backend.Repositories;

namespace backend.Services
{
    public class AdminService : IAdminService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly IResourceRepository _resourceRepository;
        private readonly IBookingRepository _bookingRepository;
        private readonly ILogger<AdminService> _logger;

        public AdminService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext context,
            IResourceRepository resourceRepository,
            IBookingRepository bookingRepository,
            ILogger<AdminService> logger)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _resourceRepository = resourceRepository;
            _bookingRepository = bookingRepository;
            _logger = logger;
        }

        // User Management Methods
        public async Task<PagedResultDto<AdminUserDto>> GetUsersAsync(UserSearchDto searchDto)
        {
            try
            {
                var query = _userManager.Users.AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(searchDto.SearchTerm))
                {
                    query = query.Where(u => 
                        u.FirstName.Contains(searchDto.SearchTerm) ||
                        u.LastName.Contains(searchDto.SearchTerm) ||
                        u.Email.Contains(searchDto.SearchTerm));
                }

                if (!string.IsNullOrEmpty(searchDto.Role))
                {
                    query = query.Where(u => u.Role == searchDto.Role);
                }

                if (searchDto.IsActive.HasValue)
                {
                    query = query.Where(u => u.IsActive == searchDto.IsActive.Value);
                }

                if (searchDto.CreatedFrom.HasValue)
                {
                    query = query.Where(u => u.CreatedAt >= searchDto.CreatedFrom.Value);
                }

                if (searchDto.CreatedTo.HasValue)
                {
                    query = query.Where(u => u.CreatedAt <= searchDto.CreatedTo.Value);
                }

                // Apply sorting
                query = searchDto.SortBy.ToLower() switch
                {
                    "email" => searchDto.SortDirection == "asc" ? query.OrderBy(u => u.Email) : query.OrderByDescending(u => u.Email),
                    "firstname" => searchDto.SortDirection == "asc" ? query.OrderBy(u => u.FirstName) : query.OrderByDescending(u => u.FirstName),
                    "lastname" => searchDto.SortDirection == "asc" ? query.OrderBy(u => u.LastName) : query.OrderByDescending(u => u.LastName),
                    "role" => searchDto.SortDirection == "asc" ? query.OrderBy(u => u.Role) : query.OrderByDescending(u => u.Role),
                    "isactive" => searchDto.SortDirection == "asc" ? query.OrderBy(u => u.IsActive) : query.OrderByDescending(u => u.IsActive),
                    _ => searchDto.SortDirection == "asc" ? query.OrderBy(u => u.CreatedAt) : query.OrderByDescending(u => u.CreatedAt)
                };

                var totalCount = await query.CountAsync();
                var users = await query
                    .Skip((searchDto.Page - 1) * searchDto.PageSize)
                    .Take(searchDto.PageSize)
                    .Select(u => new AdminUserDto
                    {
                        Id = u.Id,
                        Email = u.Email,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Role = u.Role,
                        IsActive = u.IsActive,
                        CreatedAt = u.CreatedAt,
                        UpdatedAt = u.UpdatedAt,
                        TotalBookings = u.Bookings.Count,
                        ActiveBookings = u.Bookings.Count(b => b.IsActive)
                    })
                    .ToListAsync();

                // Get roles for each user
                foreach (var user in users)
                {
                    var userEntity = await _userManager.FindByIdAsync(user.Id);
                    if (userEntity != null)
                    {
                        user.Roles = (await _userManager.GetRolesAsync(userEntity)).ToList();
                    }
                }

                return new PagedResultDto<AdminUserDto>
                {
                    Items = users,
                    TotalCount = totalCount,
                    Page = searchDto.Page,
                    PageSize = searchDto.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users");
                throw;
            }
        }

        public async Task<AdminUserDto?> GetUserByIdAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null) return null;

                var roles = await _userManager.GetRolesAsync(user);
                var totalBookings = await _context.Bookings.CountAsync(b => b.UserId == userId);
                var activeBookings = await _context.Bookings.CountAsync(b => b.UserId == userId && b.IsActive);

                return new AdminUserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = user.Role,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    Roles = roles.ToList(),
                    TotalBookings = totalBookings,
                    ActiveBookings = activeBookings
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user by ID: {UserId}", userId);
                throw;
            }
        }

        public async Task<ApiResponseDto<AdminUserDto>> CreateUserAsync(CreateUserDto createUserDto)
        {
            try
            {
                // Check if user already exists
                var existingUser = await _userManager.FindByEmailAsync(createUserDto.Email);
                if (existingUser != null)
                {
                return new ApiResponseDto<AdminUserDto>
                {
                    Success = false,
                    Message = "User already exists",
                    Errors = new List<string> { "Email is already in use" }
                };
                }

                // Check if role exists
                if (!await _roleManager.RoleExistsAsync(createUserDto.Role))
                {
                return new ApiResponseDto<AdminUserDto>
                {
                    Success = false,
                    Message = "Role does not exist",
                    Errors = new List<string> { $"Role '{createUserDto.Role}' does not exist" }
                };
                }

                var user = new ApplicationUser
                {
                    UserName = createUserDto.Email,
                    Email = createUserDto.Email,
                    FirstName = createUserDto.FirstName,
                    LastName = createUserDto.LastName,
                    Role = createUserDto.Role,
                    IsActive = createUserDto.IsActive,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user, createUserDto.Password);
                if (!result.Succeeded)
                {
                return new ApiResponseDto<AdminUserDto>
                {
                    Success = false,
                    Message = "Failed to create user",
                    Errors = result.Errors.Select(e => e.Description).ToList()
                };
                }

                // Add user to role
                await _userManager.AddToRoleAsync(user, createUserDto.Role);

                var createdUser = await GetUserByIdAsync(user.Id);
                return new ApiResponseDto<AdminUserDto>
                {
                    Success = true,
                    Message = "User created successfully",
                    Data = createdUser
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return new ApiResponseDto<AdminUserDto>
                {
                    Success = false,
                    Message = "An error occurred while creating user",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        // Continue with other methods...
        public async Task<ApiResponseDto<AdminUserDto>> UpdateUserAsync(string userId, UpdateUserDto updateUserDto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                return new ApiResponseDto<AdminUserDto>
                {
                    Success = false,
                    Message = "User not found",
                    Errors = new List<string> { "User not found" }
                };
                }

                // Check if email is already used by another user
                var existingUser = await _userManager.FindByEmailAsync(updateUserDto.Email);
                if (existingUser != null && existingUser.Id != userId)
                {
                return new ApiResponseDto<AdminUserDto>
                {
                    Success = false,
                    Message = "Email is already in use",
                    Errors = new List<string> { "Email is already used by another user" }
                };
                }

                user.FirstName = updateUserDto.FirstName;
                user.LastName = updateUserDto.LastName;
                user.Email = updateUserDto.Email;
                user.UserName = updateUserDto.Email;
                user.Role = updateUserDto.Role;
                user.IsActive = updateUserDto.IsActive;
                user.UpdatedAt = DateTime.UtcNow;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                return new ApiResponseDto<AdminUserDto>
                {
                    Success = false,
                    Message = "Failed to update user",
                    Errors = result.Errors.Select(e => e.Description).ToList()
                };
                }

                // Update user role if it has changed
                var currentRoles = await _userManager.GetRolesAsync(user);
                var newRole = updateUserDto.Role;
                
                // Remove from all current roles
                if (currentRoles.Any())
                {
                    await _userManager.RemoveFromRolesAsync(user, currentRoles);
                }
                
                // Add to new role
                await _userManager.AddToRoleAsync(user, newRole);

                var updatedUser = await GetUserByIdAsync(userId);
                return new ApiResponseDto<AdminUserDto>
                {
                    Success = true,
                    Message = "User updated successfully",
                    Data = updatedUser
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user: {UserId}", userId);
                return new ApiResponseDto<AdminUserDto>
                {
                    Success = false,
                    Message = "An error occurred while updating user",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        // Additional methods will be implemented in the next part...
        public async Task<ApiResponseDto<bool>> ChangeUserPasswordAsync(string userId, ChangePasswordDto changePasswordDto)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<ApiResponseDto<bool>> UpdateUserRoleAsync(string userId, string newRole)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<ApiResponseDto<bool>> UpdateUserStatusAsync(string userId, bool isActive)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<ApiResponseDto<bool>> DeleteUserAsync(string userId)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<ApiResponseDto<bool>> BulkUserOperationAsync(BulkUserOperationDto bulkOperationDto)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<PagedResultDto<AdminResourceDto>> GetResourcesAsync(int page = 1, int pageSize = 10)
        {
            try
            {
                var query = _context.Resources
                    .Include(r => r.ResourceType)
                    .AsQueryable();

                var totalCount = await query.CountAsync();
                
                var resources = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(r => new AdminResourceDto
                    {
                        ResourceId = r.ResourceId,
                        Name = r.Name,
                        ResourceTypeId = r.ResourceTypeId,
                        ResourceTypeName = r.ResourceType.Name,
                        IsBooked = r.IsBooked,
                        TotalBookings = 0, // Will be calculated separately if needed
                        ActiveBookings = 0, // Will be calculated separately if needed
                        LastBookingDate = null // Will be calculated separately if needed
                    })
                    .ToListAsync();

                return new PagedResultDto<AdminResourceDto>
                {
                    Items = resources,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting resources");
                throw;
            }
        }

        public async Task<AdminResourceDto?> GetResourceByIdAsync(int resourceId)
        {
            try
            {
                var resource = await _context.Resources
                    .Include(r => r.ResourceType)
                    .FirstOrDefaultAsync(r => r.ResourceId == resourceId);

                if (resource == null) return null;

                return new AdminResourceDto
                {
                    ResourceId = resource.ResourceId,
                    Name = resource.Name,
                    ResourceTypeId = resource.ResourceTypeId,
                    ResourceTypeName = resource.ResourceType.Name,
                    IsBooked = resource.IsBooked,
                    TotalBookings = 0, // Will be calculated separately if needed
                    ActiveBookings = 0, // Will be calculated separately if needed
                    LastBookingDate = null // Will be calculated separately if needed
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting resource by ID: {ResourceId}", resourceId);
                throw;
            }
        }

        public async Task<ApiResponseDto<AdminResourceDto>> CreateResourceAsync(CreateResourceDto createResourceDto)
        {
            try
            {
                // Check if resource type exists
                var resourceType = await _context.ResourceTypes
                    .FirstOrDefaultAsync(rt => rt.ResourceTypeId == createResourceDto.ResourceTypeId);
                
                if (resourceType == null)
                {
                    return new ApiResponseDto<AdminResourceDto>
                    {
                        Success = false,
                        Message = "Resource type not found",
                        Errors = new List<string> { "Resource type does not exist" }
                    };
                }

                var resource = new Resource
                {
                    Name = createResourceDto.Name,
                    ResourceTypeId = createResourceDto.ResourceTypeId,
                    IsBooked = false
                };

                _context.Resources.Add(resource);
                await _context.SaveChangesAsync();

                var createdResource = await GetResourceByIdAsync(resource.ResourceId);
                return new ApiResponseDto<AdminResourceDto>
                {
                    Success = true,
                    Message = "Resource created successfully",
                    Data = createdResource
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating resource");
                return new ApiResponseDto<AdminResourceDto>
                {
                    Success = false,
                    Message = "An error occurred while creating resource",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDto<AdminResourceDto>> UpdateResourceAsync(int resourceId, UpdateResourceDto updateResourceDto)
        {
            try
            {
                var resource = await _context.Resources
                    .FirstOrDefaultAsync(r => r.ResourceId == resourceId);

                if (resource == null)
                {
                    return new ApiResponseDto<AdminResourceDto>
                    {
                        Success = false,
                        Message = "Resource not found",
                        Errors = new List<string> { "Resource not found" }
                    };
                }

                // Check if resource type exists
                var resourceType = await _context.ResourceTypes
                    .FirstOrDefaultAsync(rt => rt.ResourceTypeId == updateResourceDto.ResourceTypeId);
                
                if (resourceType == null)
                {
                    return new ApiResponseDto<AdminResourceDto>
                    {
                        Success = false,
                        Message = "Resource type not found",
                        Errors = new List<string> { "Resource type does not exist" }
                    };
                }

                resource.Name = updateResourceDto.Name;
                resource.ResourceTypeId = updateResourceDto.ResourceTypeId;

                await _context.SaveChangesAsync();

                var updatedResource = await GetResourceByIdAsync(resourceId);
                return new ApiResponseDto<AdminResourceDto>
                {
                    Success = true,
                    Message = "Resource updated successfully",
                    Data = updatedResource
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating resource: {ResourceId}", resourceId);
                return new ApiResponseDto<AdminResourceDto>
                {
                    Success = false,
                    Message = "An error occurred while updating resource",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<ApiResponseDto<bool>> DeleteResourceAsync(int resourceId)
        {
            try
            {
                var resource = await _context.Resources
                    .FirstOrDefaultAsync(r => r.ResourceId == resourceId);

                if (resource == null)
                {
                    return new ApiResponseDto<bool>
                    {
                        Success = false,
                        Message = "Resource not found",
                        Errors = new List<string> { "Resource not found" }
                    };
                }

                // Check if resource has active bookings
                var hasActiveBookings = await _context.Bookings
                    .AnyAsync(b => b.ResourceId == resourceId && b.IsActive);

                if (hasActiveBookings)
                {
                    return new ApiResponseDto<bool>
                    {
                        Success = false,
                        Message = "Cannot delete resource with active bookings",
                        Errors = new List<string> { "Resource has active bookings" }
                    };
                }

                _context.Resources.Remove(resource);
                await _context.SaveChangesAsync();

                return new ApiResponseDto<bool>
                {
                    Success = true,
                    Message = "Resource deleted successfully",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting resource: {ResourceId}", resourceId);
                return new ApiResponseDto<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting resource",
                    Errors = new List<string> { ex.Message }
                };
            }
        }

        public async Task<List<ResourceTypeDto>> GetResourceTypesAsync()
        {
            try
            {
                var resourceTypes = await _context.ResourceTypes
                    .Select(rt => new ResourceTypeDto
                    {
                        ResourceTypeId = rt.ResourceTypeId,
                        Name = rt.Name
                    })
                    .ToListAsync();

                return resourceTypes;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting resource types");
                throw;
            }
        }

        public async Task<ApiResponseDto<ResourceType>> CreateResourceTypeAsync(CreateResourceTypeDto createResourceTypeDto)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<ApiResponseDto<ResourceType>> UpdateResourceTypeAsync(int resourceTypeId, UpdateResourceTypeDto updateResourceTypeDto)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<ApiResponseDto<bool>> DeleteResourceTypeAsync(int resourceTypeId)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<ApiResponseDto<bool>> BulkResourceOperationAsync(BulkResourceOperationDto bulkOperationDto)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<PagedResultDto<AdminBookingDto>> GetBookingsAsync(BookingSearchDto searchDto)
        {
            try
            {
                var query = _context.Bookings
                    .Include(b => b.User)
                    .Include(b => b.Resource)
                    .ThenInclude(r => r.ResourceType)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(searchDto.SearchTerm))
                {
                    var searchLower = searchDto.SearchTerm.ToLower();
                    query = query.Where(b => 
                        (b.User != null && b.User.Email.ToLower().Contains(searchLower)) ||
                        (b.User != null && b.User.FirstName.ToLower().Contains(searchLower)) ||
                        (b.User != null && b.User.LastName.ToLower().Contains(searchLower)) ||
                        (b.Resource != null && b.Resource.Name.ToLower().Contains(searchLower)) ||
                        (b.Resource != null && b.Resource.ResourceType != null && b.Resource.ResourceType.Name.ToLower().Contains(searchLower)));
                }

                if (!string.IsNullOrEmpty(searchDto.UserId))
                {
                    query = query.Where(b => b.UserId == searchDto.UserId);
                }

                if (searchDto.ResourceId.HasValue)
                {
                    query = query.Where(b => b.ResourceId == searchDto.ResourceId.Value);
                }

                if (searchDto.IsActive.HasValue)
                {
                    query = query.Where(b => b.IsActive == searchDto.IsActive.Value);
                }

                if (searchDto.BookingFrom.HasValue)
                {
                    query = query.Where(b => b.BookingDate >= searchDto.BookingFrom.Value);
                }

                if (searchDto.BookingTo.HasValue)
                {
                    query = query.Where(b => b.BookingDate <= searchDto.BookingTo.Value);
                }

                // Apply sorting
                query = searchDto.SortBy.ToLower() switch
                {
                    "bookingdate" => searchDto.SortDirection == "asc" ? query.OrderBy(b => b.BookingDate) : query.OrderByDescending(b => b.BookingDate),
                    "enddate" => searchDto.SortDirection == "asc" ? query.OrderBy(b => b.EndDate) : query.OrderByDescending(b => b.EndDate),
                    "useremail" => searchDto.SortDirection == "asc" ? query.OrderBy(b => b.User != null ? b.User.Email : "") : query.OrderByDescending(b => b.User != null ? b.User.Email : ""),
                    "resourcename" => searchDto.SortDirection == "asc" ? query.OrderBy(b => b.Resource != null ? b.Resource.Name : "") : query.OrderByDescending(b => b.Resource != null ? b.Resource.Name : ""),
                    "isactive" => searchDto.SortDirection == "asc" ? query.OrderBy(b => b.IsActive) : query.OrderByDescending(b => b.IsActive),
                    _ => searchDto.SortDirection == "asc" ? query.OrderBy(b => b.BookingDate) : query.OrderByDescending(b => b.BookingDate)
                };

                var totalCount = await query.CountAsync();
                var bookings = await query
                    .Skip((searchDto.Page - 1) * searchDto.PageSize)
                    .Take(searchDto.PageSize)
                    .Select(b => new AdminBookingDto
                    {
                        BookingId = b.BookingId,
                        UserId = b.UserId,
                        UserEmail = b.User != null ? b.User.Email : "Unknown",
                        ResourceId = b.ResourceId,
                        ResourceTypeName = b.Resource != null && b.Resource.ResourceType != null ? b.Resource.ResourceType.Name : "Unknown",
                        BookingDate = b.BookingDate,
                        EndDate = b.EndDate,
                        IsActive = b.IsActive,
                        CreatedAt = b.BookingDate
                    })
                    .ToListAsync();

                return new PagedResultDto<AdminBookingDto>
                {
                    Items = bookings,
                    TotalCount = totalCount,
                    Page = searchDto.Page,
                    PageSize = searchDto.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting bookings: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<AdminBookingDto?> GetBookingByIdAsync(int bookingId)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<ApiResponseDto<bool>> CancelBookingAsync(int bookingId, string reason)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<ApiResponseDto<bool>> ExtendBookingAsync(int bookingId, DateTime newEndDate)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<BookingStatsDto> GetBookingStatsAsync()
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<AdminDashboardDto> GetDashboardDataAsync()
        {
            try
            {
                // Get basic counts
                var totalUsers = await _userManager.Users.CountAsync();
                var activeUsers = await _userManager.Users.CountAsync(u => u.IsActive);
                var totalResources = await _context.Resources.CountAsync();
                var availableResources = await _context.Resources.CountAsync(r => !r.IsBooked);
                var totalBookings = await _context.Bookings.CountAsync();
                var activeBookings = await _context.Bookings.CountAsync(b => b.IsActive);

                // Get recent users (last 5) - simplified
                var recentUsers = new List<AdminUserDto>();
                var users = await _userManager.Users
                    .OrderByDescending(u => u.CreatedAt)
                    .Take(5)
                    .ToListAsync();

                foreach (var user in users)
                {
                    recentUsers.Add(new AdminUserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Role = user.Role,
                        IsActive = user.IsActive,
                        CreatedAt = user.CreatedAt,
                        UpdatedAt = user.UpdatedAt,
                        TotalBookings = 0,
                        ActiveBookings = 0,
                        Roles = new List<string> { user.Role }
                    });
                }

                // Get recent bookings (last 5) - simplified
                var recentBookings = new List<AdminBookingDto>();
                var bookings = await _context.Bookings
                    .Include(b => b.User)
                    .Include(b => b.Resource)
                    .ThenInclude(r => r.ResourceType)
                    .OrderByDescending(b => b.BookingDate)
                    .Take(5)
                    .ToListAsync();

                foreach (var booking in bookings)
                {
                    recentBookings.Add(new AdminBookingDto
                    {
                        BookingId = booking.BookingId,
                        UserId = booking.UserId,
                        UserEmail = booking.User?.Email ?? "Unknown",
                        ResourceId = booking.ResourceId,
                        ResourceTypeName = booking.Resource?.ResourceType?.Name ?? "Unknown",
                        BookingDate = booking.BookingDate,
                        EndDate = booking.EndDate,
                        IsActive = booking.IsActive,
                        CreatedAt = booking.BookingDate
                    });
                }

                // Get booking stats - simplified
                var completedBookings = await _context.Bookings.CountAsync(b => !b.IsActive && b.EndDate < DateTime.UtcNow);
                var cancelledBookings = await _context.Bookings.CountAsync(b => !b.IsActive && b.EndDate >= DateTime.UtcNow);

                // Simple monthly stats
                var bookingsByMonth = new Dictionary<string, int>();
                for (int i = 1; i <= 12; i++)
                {
                    var monthName = new DateTime(2024, i, 1).ToString("MMM");
                    var count = await _context.Bookings.CountAsync(b => b.BookingDate.Month == i);
                    bookingsByMonth[monthName] = count;
                }

                // Simple resource type stats
                var bookingsByResourceType = new Dictionary<string, int>();
                var resourceTypes = await _context.ResourceTypes.ToListAsync();
                foreach (var resourceType in resourceTypes)
                {
                    var count = await _context.Bookings
                        .Include(b => b.Resource)
                        .CountAsync(b => b.Resource.ResourceTypeId == resourceType.ResourceTypeId);
                    bookingsByResourceType[resourceType.Name] = count;
                }

                var bookingStats = new BookingStatsDto
                {
                    TotalBookings = totalBookings,
                    ActiveBookings = activeBookings,
                    CompletedBookings = completedBookings,
                    CancelledBookings = cancelledBookings,
                    AverageBookingDuration = 90, // Simplified for now
                    MostPopularResourceId = 1,
                    MostPopularResourceName = "Meeting Room A",
                    BookingsByMonth = bookingsByMonth,
                    BookingsByResourceType = bookingsByResourceType
                };

                return new AdminDashboardDto
                {
                    TotalUsers = totalUsers,
                    ActiveUsers = activeUsers,
                    TotalBookings = totalBookings,
                    ActiveBookings = activeBookings,
                    TotalResources = totalResources,
                    AvailableResources = availableResources,
                    BookingStats = bookingStats,
                    RecentUsers = recentUsers,
                    RecentBookings = recentBookings
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard data: {Message}", ex.Message);
                throw;
            }
        }

        public async Task<ApiResponseDto<bool>> CleanupExpiredBookingsAsync()
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<ApiResponseDto<bool>> GenerateSystemReportAsync()
        {
            // Implementation will be added
            throw new NotImplementedException();
        }

        public async Task<List<string>> GetSystemLogsAsync(int count = 100)
        {
            // Implementation will be added
            throw new NotImplementedException();
        }
    }
}
