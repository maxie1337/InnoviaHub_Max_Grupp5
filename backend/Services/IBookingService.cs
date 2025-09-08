using System;
using InnoviaHub_Grupp5.Models.DTOs;

namespace backend.Services;

public interface IBookingService
{
    Task<IEnumerable<BookingDTO>> GetAllAsync();
    Task<BookingDTO> CreateAsync(BookingDTO dto);
}
