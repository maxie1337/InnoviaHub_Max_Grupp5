using backend.Models;
using backend.Repositories;
using InnoviaHub_Grupp5.Models.DTOs;
using InnoviaHub_Grupp5.Services;

namespace backend.Services
{
    
    public class ResourceService : IResourceService
    {
        private readonly IResourceRepository _repository;

        public ResourceService(IResourceRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ResourceDTO>> GetAllAsync()
        {
            var resources = await _repository.GetAllAsync();
            return resources.Select(r => new ResourceDTO
            {
                ResourceId = r.ResourceId,
                Type = r.Type,
                IsBooked = r.IsBooked
            });
        }

        public async Task<ResourceDTO?> GetByIdAsync(int id)
        {
            var resource = await _repository.GetByIdAsync(id);
            if (resource == null) return null;
            return new ResourceDTO
            {
                //ResourceId = id,
                Type = resource.Type,
                IsBooked = resource.IsBooked
            };
        }

        public async Task<ResourceDTO> CreateAsync(ResourceDTO dto)
        {
            var resource = new Resource
            {
                //ResourceId = dto.ResourceId,
                Type = dto.Type,
                IsBooked = dto.IsBooked
            };
            var created = await _repository.CreateAsync(resource);
            
            return new ResourceDTO
            {
                //ResourceId = created.ResourceId,
                Type = created.Type,
                IsBooked = created.IsBooked
            };
        }

        public async Task<ResourceDTO?> UpdateAsync(int id, ResourceDTO dto)
        {
            var resource = await _repository.GetByIdAsync(id);
            if (resource == null) return null;

            resource.Type = dto.Type;
            resource.IsBooked = dto.IsBooked;
            var updated = await _repository.UpdateAsync(resource);

            return new ResourceDTO
            {
                ResourceId = id,
                Type = updated.Type,
                IsBooked = updated.IsBooked
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}