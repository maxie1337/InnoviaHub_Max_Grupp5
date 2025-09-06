using AutoMapper;
using backend.Models;
using backend.Models.DTOs.Resource;

namespace backend.Mapping
{
    public class ResourceMappingProfile : Profile
    {
        public ResourceMappingProfile()
        {
            // Map Resource --> ResourceResDTO
            CreateMap<Resource, ResourceResDTO>();

            // Map ResourceReqDTO --> Resource
            CreateMap<ResourceReqDTO, Resource>();


        }
    }
}
