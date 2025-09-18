using backend.Models;
using backend.Models.DTOs;

namespace backend.Services
{
    public interface IAdminService
    {
        // User Management
        Task<PagedResultDto<AdminUserDto>> GetUsersAsync(UserSearchDto searchDto);
        Task<AdminUserDto?> GetUserByIdAsync(string userId);
        Task<ApiResponseDto<AdminUserDto>> CreateUserAsync(CreateUserDto createUserDto);
        Task<ApiResponseDto<AdminUserDto>> UpdateUserAsync(string userId, UpdateUserDto updateUserDto);
        Task<ApiResponseDto<bool>> ChangeUserPasswordAsync(string userId, ChangePasswordDto changePasswordDto);
        Task<ApiResponseDto<bool>> UpdateUserRoleAsync(string userId, string newRole);
        Task<ApiResponseDto<bool>> UpdateUserStatusAsync(string userId, bool isActive);
        Task<ApiResponseDto<bool>> DeleteUserAsync(string userId);
        Task<ApiResponseDto<bool>> BulkUserOperationAsync(BulkUserOperationDto bulkOperationDto);

        // Resource Management
        Task<PagedResultDto<AdminResourceDto>> GetResourcesAsync(int page = 1, int pageSize = 10);
        Task<AdminResourceDto?> GetResourceByIdAsync(int resourceId);
        Task<ApiResponseDto<AdminResourceDto>> CreateResourceAsync(CreateResourceDto createResourceDto);
        Task<ApiResponseDto<AdminResourceDto>> UpdateResourceAsync(int resourceId, UpdateResourceDto updateResourceDto);
        Task<ApiResponseDto<bool>> DeleteResourceAsync(int resourceId);
        Task<List<ResourceTypeDto>> GetResourceTypesAsync();
        Task<ApiResponseDto<ResourceType>> CreateResourceTypeAsync(CreateResourceTypeDto createResourceTypeDto);
        Task<ApiResponseDto<ResourceType>> UpdateResourceTypeAsync(int resourceTypeId, UpdateResourceTypeDto updateResourceTypeDto);
        Task<ApiResponseDto<bool>> DeleteResourceTypeAsync(int resourceTypeId);
        Task<ApiResponseDto<bool>> BulkResourceOperationAsync(BulkResourceOperationDto bulkOperationDto);

        // Booking Management
        Task<PagedResultDto<AdminBookingDto>> GetBookingsAsync(BookingSearchDto searchDto);
        Task<AdminBookingDto?> GetBookingByIdAsync(int bookingId);
        Task<ApiResponseDto<bool>> CancelBookingAsync(int bookingId, string reason);
        Task<ApiResponseDto<bool>> ExtendBookingAsync(int bookingId, DateTime newEndDate);
        Task<BookingStatsDto> GetBookingStatsAsync();

        // Dashboard
        Task<AdminDashboardDto> GetDashboardDataAsync();

        // System Management
        Task<ApiResponseDto<bool>> CleanupExpiredBookingsAsync();
        Task<ApiResponseDto<bool>> GenerateSystemReportAsync();
        Task<List<string>> GetSystemLogsAsync(int count = 100);
    }
}




