using AutoMapper;
using InnoviaHub_Grupp5.Models;
using InnoviaHub_Grupp5.Models.DTOs;

namespace InnoviaHub_Grupp5.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Booking, BookingDTO>();
            CreateMap<Resources, ResourcesDTO>();
            CreateMap<User, UserDTO>();
        }
    }
}