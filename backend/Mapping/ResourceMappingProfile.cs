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
            CreateMap<Resource, ResourceResDTO>()
                .ForMember(dest => dest.ResourceTypeName, opt => opt.MapFrom(src => src.ResourceType.Name));

            // Map ResourceReqDTO --> Resource
            CreateMap<ResourceReqDTO, Resource>();

            // Map ResourceDTO --> Resource
            CreateMap<ResourceDTO, Resource>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        }
    }
}
