// Services/IResourceService.cs
using InnoviaHub_Grupp5.Models.DTOs;

namespace InnoviaHub_Grupp5.Services
{
    public interface IResourceService
    {
        Task<IEnumerable<ResourceDTO>> GetAllAsync();
        Task<ResourceDTO?> GetByIdAsync(int id);
        Task<ResourceDTO> CreateAsync(ResourceDTO dto);
        Task<ResourceDTO?> UpdateAsync(int id, ResourceDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}
