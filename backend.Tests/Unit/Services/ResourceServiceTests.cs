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


        // Initialize all variables in the test constructor
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
            // Invoke the method we want to test
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



        // -----------------------
        // GetByIdAsync tests
        // -----------------------


        [Fact]
        public async Task GetByIdAsync_ReturnsDTO_WhenResourceExists()
        {
            // 1. ARRANGE
            var resource = new Resource { ResourceId = 10, Name = "VR Headset 1", ResourceTypeId = 3, IsBooked = false };

            var dto = new ResourceResDTO { ResourceId = 10, ResourceTypeId = 3, ResourceTypeName = "VRset", Name = "VR Headset 1", IsBooked = false };

            // Repository returns the resource object for id 10
            _mockRepo.Setup(r => r.GetByIdAsync(10)).ReturnsAsync(resource);

            // Mapper maps the resource object to DTO
            _mockMapper.Setup(m => m.Map<ResourceResDTO>(resource)).Returns(dto);


            // 2. ACT
            // Invoke the method we want to test
            var result = await _service.GetByIdAsync(10);


            // 3. ASSERT
            Assert.NotNull(result);
            Assert.Equal(10, result.ResourceId);
            Assert.Equal("VR Headset 1", result.Name);

            // Verify that repository's GetByIdAsync was called exactly once
            _mockRepo.Verify(r => r.GetByIdAsync(10), Times.Once);

            // Verify mapper was called at least once
            _mockMapper.Verify(m => m.Map<ResourceResDTO>(resource), Times.Once);
        }


        // -----------------------
        // CreateAsync tests
        // -----------------------

        [Fact]
        public async Task CreateAsync_CreatesAndReturnsMappedDTO()
        {

            // 1. ARRANGE
            var reqDto = new ResourceReqDTO { Name = "AI Server", ResourceTypeId = 4 };

            // The repository is expected to return a domain object with an Id after creation
            var createdResource = new Resource { ResourceId = 300, Name = "Meeting Room 1", ResourceTypeId = 2, IsBooked = false };

            var createdDto = new ResourceResDTO { ResourceId = 300, ResourceTypeId = 2, ResourceTypeName = "MeetingRoom", Name = "Meeting Room 1", IsBooked = false };

            // Setup repository CreateAsync to return the created resource
            _mockRepo.Setup(r => r.CreateAsync(It.IsAny<Resource>())).ReturnsAsync(createdResource);

            // Setup mapper to map the created resource object to the response DTO
            _mockMapper.Setup(m => m.Map<ResourceResDTO>(createdResource)).Returns(createdDto);


            // 2. ACT
            // Invoke the method we want to test
            var result = await _service.CreateAsync(reqDto);


            // 3. ASSERT
            Assert.NotNull(result);
            Assert.Equal(300, result.ResourceId);
            Assert.Equal("Meeting Room 1", result.Name);

            // Verify repository's CreateAsync was called once and the mapper was used
            _mockRepo.Verify(r => r.CreateAsync(It.IsAny<Resource>()), Times.Once);
            _mockMapper.Verify(m => m.Map<ResourceResDTO>(createdResource), Times.Once);
        }


        // -----------------------
        // UpdateAsync tests
        // -----------------------

        [Fact]
        public async Task UpdateAsync_UpdatesValues_AndReturnsMappedDTO_WhenResourceExists()
        {
            // 1. ARRANGE
            var existing = new Resource { ResourceId = 5, Name = "Desk 1", ResourceTypeId = 2, IsBooked = false };

            // DTO with the new values
            var updateDto = new ResourceDTO { Name = "Desk #1", ResourceTypeId = 1, IsBooked = true };

            // Repository will return the existing object when GetByIdAsync is called
            _mockRepo.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(existing);

            // Repository UpdateAsync should return the updated resource (simulate DB update)
            var updatedResource = new Resource { ResourceId = 5, Name = "Desk #1", ResourceTypeId = 1, IsBooked = true };

            _mockRepo.Setup(r => r.UpdateAsync(It.IsAny<Resource>())).ReturnsAsync(updatedResource);

            // Mapper maps the updated resource object to response DTO
            var resDto = new ResourceResDTO { ResourceId = 5, Name = "Desk #1" };
            _mockMapper.Setup(m => m.Map<ResourceResDTO>(updatedResource)).Returns(resDto);


            // 2. ACT
            // Call the method we want to test
            var result = await _service.UpdateAsync(5, updateDto);


            // 3. ASSERT
            Assert.NotNull(result);
            Assert.Equal(5, result.ResourceId);
            Assert.Equal("Desk #1", result.Name);

            // Verify GetByIdAsync was called and UpdateAsync was called with a Resource whose fields were updated.
            _mockRepo.Verify(r => r.GetByIdAsync(5), Times.Once);

            // We verify that UpdateAsync was called with a Resource that has the new values
            _mockRepo.Verify(r => r.UpdateAsync(It.Is<Resource>(
                r => r.ResourceId == 5 &&
                     r.Name == "Desk #1" &&
                     r.ResourceTypeId == 1 &&
                     r.IsBooked == true)), Times.Once);

            _mockMapper.Verify(m => m.Map<ResourceResDTO>(updatedResource), Times.Once);
        }


        // -----------------------
        // DeleteAsync tests
        // -----------------------

        [Fact]
        public async Task DeleteAsync_ReturnsTrue_WhenRepositoryDeletesSuccessfully()
        {
            // 1. ARRANGE
            _mockRepo.Setup(r => r.DeleteAsync(1)).ReturnsAsync(true);

            // 2. ACT
            var result = await _service.DeleteAsync(1);

            // 3. ASSERT
            Assert.True(result);
            _mockRepo.Verify(r => r.DeleteAsync(1), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_ReturnsFalse_WhenRepositoryFailsToDelete()
        {
            // ARRANGE
            _mockRepo.Setup(r => r.DeleteAsync(1999)).ReturnsAsync(false);

            // ACT
            var result = await _service.DeleteAsync(1999);

            // ASSERT
            Assert.False(result);
            _mockRepo.Verify(r => r.DeleteAsync(1999), Times.Once);
        }


    }
}
