using AutoMapper;
using backend.Models;
using InnoviaHub_Grupp5.Models.DTOs;

namespace InnoviaHub_Grupp5.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Booking, BookingDTO>();
            CreateMap<Resource, ResourceDTO>();
            CreateMap<AppUser, AppUserDTO>();
        }
    }
}