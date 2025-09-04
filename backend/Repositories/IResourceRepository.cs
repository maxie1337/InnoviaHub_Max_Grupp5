using backend.Models;

namespace backend.Repositories
{

    public interface IResourceRepository
    {
        Task<IEnumerable<Resource>> GetAllAsync();
        Task<Resource> GetByIdAsync(int id);
        Task<Resource> CreateAsync(Resource resource);
        Task<Resource> UpdateAsync(Resource resource);
        Task<bool> DeleteAsync(int id);
    }
}