using System;
using backend.Data;
using backend.Models;
using backend.Repositories;
using backend.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _repository;

    public BookingService(IBookingRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Booking> GetByIdAsync(int BookingId)
    {
        return await _repository.GetByIdAsync(BookingId);
    }

    public async Task<Booking> CreateAsync(string UserId, BookingDTO dto)
    {
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
