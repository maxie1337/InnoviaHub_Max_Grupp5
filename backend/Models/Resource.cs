using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Resource
{
    public int ResourceId { get; set; }

    public int ResourceTypeId { get; set; }

    public ResourceType ResourceType { get; set; } = null!;

    [Required]
    public string Name { get; set; } = null!; // "Desk #1", "Meeting Room A"

    public bool IsBooked { get; set; }
}
