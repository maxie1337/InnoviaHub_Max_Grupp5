using System;
using backend.Data;
using backend.Models;
using backend.Repositories;
using InnoviaHub_Grupp5.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _repository;
    private readonly ApplicationDbContext _context;

    public BookingService(IBookingRepository repository, ApplicationDbContext context)
    {
        _repository = repository;
        _context = context;
    }

    public async Task<IEnumerable<BookingDTO>> GetAllAsync()
    {
        var bookings = await _repository.GetAllAsync();
        return bookings.Select(b => new BookingDTO
        {
            UserId = b.UserId,
            ResourceId = b.ResourceId,
            BookingDate = b.BookingDate,
            EndDate = b.EndDate
        });
    }

    public async Task<BookingDTO> CreateAsync(BookingDTO dto)
    {
        var booking = new Booking
        {
            IsActive = true,
            BookingDate = dto.BookingDate,
            EndDate = dto.EndDate,
            User = ,
            UserId = dto.UserId,
            Resource = await _context.Resources.FirstAsync(r => r.ResourceId == dto.ResourceId),
            ResourceId = dto.ResourceId
        };
        var created = await _repository.CreateAsync(booking);
        
        return new ResourceDTO
        {
            //ResourceId = created.ResourceId,
            Type = created.Type,
            IsBooked = created.IsBooked
        };
    }
}
