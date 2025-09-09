using AutoMapper;
using backend.Models;
using backend.Models.DTOs.Resource;
using backend.Repositories;
using backend.Services;
using Moq;

namespace backend.Tests.Unit.Services
{
    /// <summary>
    /// Unit tests for ResourceService.
    /// We mock the IResourceRepository and IMapper dependencies so tests run fast and do not touch a database.
    /// </summary>
    public class ResourceServiceTests
    {

        // Mock objects for dependencies
        private readonly Mock<IResourceRepository> _mockRepo;
        private readonly Mock<IMapper> _mockMapper;

        // The service we want to test
        private readonly ResourceService _service;


        public ResourceServiceTests()
        {
            // Create mocks and the service instance
            _mockRepo = new Mock<IResourceRepository>();
            _mockMapper = new Mock<IMapper>();

            // Create the real service instance but pass in mocked dependencies:
            // - repository is mocked so we control what it returns
            // - mapper is mocked so we control mapping behavior
            _service = new ResourceService(_mockRepo.Object, _mockMapper.Object);
        }


        // -----------------------
        // GetAllAsync tests
        // -----------------------


        [Fact]
        public async Task GetAllAsync_ReturnsMappedDTOs()
        {
            // 1. ARRANGE
            // Create sample models and DTOs
            var resources = new List<Resource>
            {
                new Resource { ResourceId = 1, Name = "Desk #1", ResourceTypeId = 1, IsBooked = false },
                new Resource { ResourceId = 2, Name = "Desk #2", ResourceTypeId = 1, IsBooked = true }
            };

            var mappedDtos = new List<ResourceResDTO>
            {
                new ResourceResDTO { ResourceId = 1, ResourceTypeId = 1, ResourceTypeName = "DropInDesk", Name = "Desk #1", IsBooked = false },
                new ResourceResDTO { ResourceId = 2, ResourceTypeId = 1, ResourceTypeName = "DropInDesk", Name = "Desk #2", IsBooked = true }
            };

            // Tell the mock repository to return the sample models
            _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(resources);

            // Tell the mock mapper to return DTO list when mapping any object
            _mockMapper
                .Setup(m => m.Map<IEnumerable<ResourceResDTO>>(It.IsAny<object>()))
                .Returns(mappedDtos);


            // 2. ACT
            var result = await _service.GetAllAsync();


            // 3. ASSERT
            Assert.NotNull(result);                                // result should not be null
            var resultList = result.ToList();
            Assert.Equal(2, resultList.Count);                     // we expect two items
            Assert.Equal("Desk #1", resultList[0].Name);           // first item name matches
            Assert.Equal("Desk #2", resultList[1].Name);           // second item name matches

            // Verify that repository's GetAllAsync was called exactly once
            _mockRepo.Verify(r => r.GetAllAsync(), Times.Once);

            // Verify mapper was called at least once
            _mockMapper.Verify(m => m.Map<IEnumerable<ResourceResDTO>>(It.IsAny<object>()), Times.Once);
        }


    }
}
