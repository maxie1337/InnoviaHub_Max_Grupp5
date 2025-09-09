using AutoMapper;
using backend.Models;
using backend.Models.DTOs.Resource;
using backend.Repositories;

namespace backend.Services
{

    public class ResourceService : IResourceService
    {
        private readonly IResourceRepository _repository;
        private readonly IMapper _mapper;

        public ResourceService(IResourceRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ResourceResDTO>> GetAllAsync()
        {
            var resources = await _repository.GetAllAsync();

            // Map Resource --> ResourceResDTO
            return _mapper.Map<IEnumerable<ResourceResDTO>>(resources);
        }

        public async Task<ResourceResDTO?> GetByIdAsync(int id)
        {
            var resource = await _repository.GetByIdAsync(id);

            if (resource == null) return null;

            // Map Resource --> ResourceDTO
            return _mapper.Map<ResourceResDTO>(resource);
        }

        public async Task<ResourceResDTO> CreateAsync(ResourceReqDTO dto)
        {
            var resource = new Resource
            {
                ResourceTypeId = dto.ResourceTypeId,
                Name = dto.Name,
                IsBooked = false
            };

            // Save to repository
            var created = await _repository.CreateAsync(resource);

            // Map Resource --> ResourceResDTO
            return _mapper.Map<ResourceResDTO>(created);
        }

        public async Task<ResourceResDTO?> UpdateAsync(int id, ResourceDTO dto)
        {
            var resource = await _repository.GetByIdAsync(id);

            if (dto.ResourceTypeId.HasValue)
                resource.ResourceTypeId = dto.ResourceTypeId.Value;

            if (!string.IsNullOrEmpty(dto.Name))
                resource.Name = dto.Name;

            if (dto.IsBooked.HasValue)
                resource.IsBooked = dto.IsBooked.Value;

            var updated = await _repository.UpdateAsync(resource);

            // Map updated Resource --> ResourceResDTO
            return _mapper.Map<ResourceResDTO>(updated);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}