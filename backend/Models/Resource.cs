using System;

namespace backend.Models;

public enum ResourceType
{
    DropInDesk,
    MeetingRoom,
    VRset,
    AIserver
}

public class Resource
{
    public int ResourceId { get; set; }
    public ResourceType Type { get; set; }
    public bool IsBooked { get; set; }
}
