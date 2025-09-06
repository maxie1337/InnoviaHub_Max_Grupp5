// Services/IResourceService.cs
using backend.Models.DTOs.Resource;

namespace backend.Services
{
    public interface IResourceService
    {
        Task<IEnumerable<ResourceResDTO>> GetAllAsync();
        Task<ResourceResDTO?> GetByIdAsync(int id);
        Task<ResourceResDTO> CreateAsync(ResourceReqDTO dto);
        Task<ResourceResDTO?> UpdateAsync(int id, ResourceDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}
