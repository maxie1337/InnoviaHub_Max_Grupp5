import { useContext, useEffect, useMemo, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { UserContext } from "@/context/UserContext";
import type { Resource } from "@/types/resource";
import type { Booking } from "@/types/booking";
import { fetchResources } from "@/api/resourceApi";
import { fetchBookings, fetchMyBookings, createBooking, cancelBooking } from "@/api/bookingApi";
import ResourceCard from "@/components/Resource/ResourceCard";
import toast from "react-hot-toast";

//Content for bookingpage
export default function BookingsPage() {
  const { token} = useContext(UserContext);
  const user = useContext(UserContext);
  //State for recourses, bookings and loading
  const [resources, setResources] = useState<Resource[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  //SignalR URL
  const hubUrl = useMemo(
    () => `${import.meta.env.VITE_API_BASE_URL}/bookingHub`,
    []
  );

  //Gets resources, bookings and setting up signalR connection
  useEffect(() => {
    if (!token) return;

    //Gets resources and bookings at the same time
    Promise.all([fetchResources(token), fetchBookings(token), fetchMyBookings(token)])
      .then(([resources, allBookings, myBookings]) => {
        setResources(resources);
        setAllBookings(allBookings);
        setMyBookings(myBookings);
      })
      .catch(() => {
        toast.error("Kunde inte hämta resurser eller bokningar");
      })
      .finally(() => setLoading(false));


    //Creating signalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token || "",
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    //Starting connection
    const start = async () => {
      try {
        await connection.start();
        console.log("SignalR connected");
      } catch (err) {
        console.error("SignalR start error:", err);
      }
    };
    start();

    //Function to get resources and bookings when a change is made
    const refreshData = async () => {
      const [newResources, newAllBookings, newMyBookings] = await Promise.all([
        fetchResources(token),
        fetchBookings(token),
        fetchMyBookings(token),
      ]);
      setResources(newResources);
      setAllBookings(newAllBookings);
      setMyBookings(newMyBookings);
    };

    //Listening on signalR events (Changes in bookings)
    connection.on("BookingCreated", refreshData);
    connection.on("BookingCancelled", refreshData);
    connection.on("BookingDeleted", refreshData);
    connection.on("BookingUpdated", refreshData);
    connection.on("ResourceUpdated", refreshData);

    //Stopping connection
    return () => {
      connection.stop();
    };
  }, [token, hubUrl]);

  //Function for booking a resource
  const handleBook = async (resourceId: number, selectedDates: Date[]) => {
    if (!token) return;
    try {
      await createBooking(token, resourceId, selectedDates);
      toast.success("Bokning skapad!");
      
      //Updating data after a booking
      const [newResources, newAllBookings, newMyBookings] = await Promise.all([
        fetchResources(token),
        fetchBookings(token),
        fetchMyBookings(token),
      ]);
      setResources(newResources);
      setAllBookings(newAllBookings);
      setMyBookings(newMyBookings);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Kunde inte skapa bokning");
    }
  };

  //Function to cancel a booking
  const handleCancel = async (bookingId: number) => {
    if (!token) return;
    try {
      await cancelBooking(token, bookingId);
      toast.success("Bokning avbokad!");

      //Updating data after cancel has happened
      const [newResources, newAllBookings, newMyBookings] = await Promise.all([
        fetchResources(token),
        fetchBookings(token),
        fetchMyBookings(token),
      ]);
      setResources(newResources);
      setAllBookings(newAllBookings);
      setMyBookings(newMyBookings);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Kunde inte avboka");
    }
  };

  //Loading text while resources are getting fetched
  if (loading) return <p className="text-gray-600">Laddar resurser...</p>;

  //Grouping of resources to handle differently
  const desks = resources.filter((r) => r.resourceTypeName === "DropInDesk");
  const meetingRooms = resources.filter((r) => r.resourceTypeName === "MeetingRoom");
  const vrSets = resources.filter((r) => r.resourceTypeName === "VRset");
  const aiServers = resources.filter((r) => r.resourceTypeName === "AIserver");

  //Page with resourcecard component
  return (

  <div className="p-6 space-y-12">
    <h1 className="text-2xl font-bold">Boka resurser</h1>

    {desks.length > 0 && (
      <div>
        <h3 className="text-2xl font-bold">Skrivbord</h3>
        <div
          className="grid gap-4 p-6 rounded-lg justify-center"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {desks.map((r) => (
            <div
              key={r.resourceId}
              className="p-2 rounded shadow bg-blue-100"
            >
              <ResourceCard
                resource={r}
                allBookings={allBookings}
                myBookings={myBookings}
                onBook={handleBook}
                onCancel={handleCancel}
              />
            </div>
          ))}
        </div>
      </div>
    )}

    {meetingRooms.length > 0 && (
      <div>
        <h3 className="text-2xl font-bold">Mötesrum</h3>
        <div className="grid gap-4 p-6 rounded-lg justify-center"
        style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {meetingRooms.map((r) => (
            <div
              key={r.resourceId}
              className="p-2 rounded shadow bg-green-100"
            >
              <ResourceCard
                resource={r}
                allBookings={allBookings}
                myBookings={myBookings}
                onBook={handleBook}
                onCancel={handleCancel}
              />
            </div>
          ))}
        </div>
      </div>
    )}

    {vrSets.length > 0 && (
      <div>
        <h3 className="text-2xl font-bold">VR Headsets</h3>
        <div className="grid gap-4 p-6 rounded-lg justify-center"
        style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          {vrSets.map((r) => (
            <div
              key={r.resourceId}
              className="p-2 rounded shadow bg-purple-100"
            >
              <ResourceCard
                resource={r}
                allBookings={allBookings}
                myBookings={myBookings}
                onBook={handleBook}
                onCancel={handleCancel}
              />
            </div>
          ))}
        </div>
      </div>
    )}

    {aiServers.length > 0 && (
      <div>
        <h3 className="text-2xl font-bold">AI Server</h3>
        <div className="grid gap-4 p-6 rounded-lg justify-center"
        style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            maxWidth: "200px",
            margin: "0 auto",
          }}
        >
          {aiServers.map((r) => (
            <div
              key={r.resourceId}
              className="p-2 rounded shadow bg-red-100"
            >
              <ResourceCard
                resource={r}
                allBookings={allBookings}
                myBookings={myBookings}
                onBook={handleBook}
                onCancel={handleCancel}
              />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)};