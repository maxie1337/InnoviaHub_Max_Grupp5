using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs
{
    // User Management DTOs
    public class AdminUserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
        public int TotalBookings { get; set; }
        public int ActiveBookings { get; set; }
    }

    public class CreateUserDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name must be less than 50 characters")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name must be less than 50 characters")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password confirmation is required")]
        [Compare("Password", ErrorMessage = "Password and confirmation do not match")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; } = "Member";

        public bool IsActive { get; set; } = true;
    }

    public class UpdateUserDto
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name must be less than 50 characters")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, ErrorMessage = "Last name must be less than 50 characters")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; } = "Member";

        public bool IsActive { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "New password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string NewPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password confirmation is required")]
        [Compare("NewPassword", ErrorMessage = "Password and confirmation do not match")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    // Resource Management DTOs
    public class AdminResourceDto
    {
        public int ResourceId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ResourceTypeId { get; set; }
        public string ResourceTypeName { get; set; } = string.Empty;
        public bool IsBooked { get; set; }
        public int TotalBookings { get; set; }
        public int ActiveBookings { get; set; }
        public DateTime? LastBookingDate { get; set; }
    }

    public class CreateResourceDto
    {
        [Required(ErrorMessage = "Resource name is required")]
        [StringLength(100, ErrorMessage = "Resource name must be less than 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Resource type is required")]
        public int ResourceTypeId { get; set; }
    }

    public class UpdateResourceDto
    {
        [Required(ErrorMessage = "Resource name is required")]
        [StringLength(100, ErrorMessage = "Resource name must be less than 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Resource type is required")]
        public int ResourceTypeId { get; set; }
    }

    public class CreateResourceTypeDto
    {
        [Required(ErrorMessage = "Resource type name is required")]
        [StringLength(50, ErrorMessage = "Resource type name must be less than 50 characters")]
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateResourceTypeDto
    {
        [Required(ErrorMessage = "Resource type name is required")]
        [StringLength(50, ErrorMessage = "Resource type name must be less than 50 characters")]
        public string Name { get; set; } = string.Empty;
    }

    public class ResourceTypeDto
    {
        public int ResourceTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    // Booking Management DTOs
    public class AdminBookingDto
    {
        public int BookingId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public int ResourceId { get; set; }
        public string ResourceName { get; set; } = string.Empty;
        public string ResourceTypeName { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public TimeSpan Duration => EndDate - BookingDate;
    }

    public class BookingStatsDto
    {
        public int TotalBookings { get; set; }
        public int ActiveBookings { get; set; }
        public int CompletedBookings { get; set; }
        public int CancelledBookings { get; set; }
        public double AverageBookingDuration { get; set; }
        public int MostPopularResourceId { get; set; }
        public string MostPopularResourceName { get; set; } = string.Empty;
        public Dictionary<string, int> BookingsByResourceType { get; set; } = new();
        public Dictionary<string, int> BookingsByMonth { get; set; } = new();
    }

    // Dashboard DTOs
    public class AdminDashboardDto
    {
        public int TotalUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int TotalResources { get; set; }
        public int AvailableResources { get; set; }
        public int TotalBookings { get; set; }
        public int ActiveBookings { get; set; }
        public List<AdminUserDto> RecentUsers { get; set; } = new();
        public List<AdminBookingDto> RecentBookings { get; set; } = new();
        public BookingStatsDto BookingStats { get; set; } = new();
    }

    // Search and Filter DTOs
    public class UserSearchDto
    {
        public string? SearchTerm { get; set; }
        public string? Role { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? CreatedFrom { get; set; }
        public DateTime? CreatedTo { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "CreatedAt";
        public string SortDirection { get; set; } = "desc";
    }

    public class BookingSearchDto
    {
        public string? SearchTerm { get; set; }
        public int? ResourceId { get; set; }
        public string? UserId { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? BookingFrom { get; set; }
        public DateTime? BookingTo { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string SortBy { get; set; } = "BookingDate";
        public string SortDirection { get; set; } = "desc";
    }

    // Response DTOs
    public class PagedResultDto<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        public bool HasNextPage => Page < TotalPages;
        public bool HasPreviousPage => Page > 1;
    }

    public class ApiResponseDto<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string> Errors { get; set; } = new();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    // Bulk Operations DTOs
    public class BulkUserOperationDto
    {
        [Required(ErrorMessage = "User IDs are required")]
        public List<string> UserIds { get; set; } = new();

        [Required(ErrorMessage = "Operation type is required")]
        public string Operation { get; set; } = string.Empty; // "activate", "deactivate", "delete", "changeRole"

        public string? NewRole { get; set; }
    }

    public class BulkResourceOperationDto
    {
        [Required(ErrorMessage = "Resource IDs are required")]
        public List<int> ResourceIds { get; set; } = new();

        [Required(ErrorMessage = "Operation type is required")]
        public string Operation { get; set; } = string.Empty; // "delete", "changeType"

        public int? NewResourceTypeId { get; set; }
    }
}
