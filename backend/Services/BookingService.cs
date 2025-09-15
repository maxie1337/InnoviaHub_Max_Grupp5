using System;
using backend.Data;
using backend.Models;
using backend.Repositories;
using backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using backend.Models.DTOs.Resource;

namespace backend.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _repository;
    private readonly IResourceService _resourceService;

    public BookingService(IBookingRepository repository, IResourceService resourceService)
    {
        _repository = repository;
        _resourceService = resourceService;
    }

    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Booking> GetByIdAsync(int BookingId)
    {
        return await _repository.GetByIdAsync(BookingId);
    }

    public async Task<IEnumerable<Booking>> GetMyBookingsAsync(string UserId)
    {
        return await _repository.GetMyBookingsAsync(UserId);
    }

    public async Task<Booking> CreateAsync(string UserId, BookingDTO dto)
    {
        var resource = await _resourceService.GetByIdAsync(dto.ResourceId);
        if (resource == null)
        {
            throw new Exception("ResourceDoesntExist");
        }
        else if (resource.IsBooked == true)
        {
            throw new Exception("ResourceIsOccupied");
        }
        else
        {
            var resourceDTO = new ResourceDTO
            {
                ResourceTypeId = resource.ResourceTypeId,
                Name = resource.Name,
                IsBooked = true
            };

            await _resourceService.UpdateAsync(resource.ResourceId, resourceDTO);
        }

        var booking = new Booking
        {
            IsActive = true,
            BookingDate = dto.BookingDate,
            EndDate = dto.EndDate,
            UserId = UserId,
            ResourceId = dto.ResourceId
        };
        var created = await _repository.CreateAsync(booking);

        return created;
    }

    public async Task<Booking> UpdateAsync(Booking booking)
    {
        return await _repository.UpdateAsync(booking);
    }

    public async Task<string> CancelBookingAsync(string UserId, bool isAdmin, int BookingId)
    {
        var result = await _repository.CancelBookingAsync(UserId, isAdmin, BookingId);
        return result;
    }

    public async Task<bool> DeleteAsync(int BookingId)
    {
        return await _repository.DeleteAsync(BookingId);
    }
}
