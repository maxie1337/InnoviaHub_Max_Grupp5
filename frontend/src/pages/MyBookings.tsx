import { cancelBooking, fetchMyBookings } from "@/api/bookingApi";
import { UserContext } from "@/context/UserContext";
import type { Booking } from "@/types/booking";
import { useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as signalR from "@microsoft/signalr";
import MyBookingCard from "@/components/MyBooking/MyBookingCard";
import "./MyBookings.css";

const MyBookings: React.FC = () => {
  const { token } = useContext(UserContext);

  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const hubUrl = useMemo(
    () => `${import.meta.env.VITE_API_BASE_URL}/bookingHub`,
    []
  );

  useEffect(() => {
    if (!token) return;

    // Initial fetch
    Promise.all([fetchMyBookings(token)])
      .then(([bookings]) => {
        setMyBookings(bookings);
      })
      .catch(() => {
        toast.error("Kunde inte hämta bokningar");
      })
      .finally(() => setLoading(false));

    // SignalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => token || "",
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    const start = async () => {
      try {
        await connection.start();
        console.log("SignalR connected (MyBookings)");
      } catch (err) {
        console.error("SignalR start error:", err);
      }
    };
    start();

    const refreshData = async () => {
      const [newMyBookings] = await Promise.all([fetchMyBookings(token)]);
      setMyBookings(newMyBookings);
    };

    connection.on("BookingCreated", refreshData);
    connection.on("BookingCancelled", refreshData);
    connection.on("BookingDeleted", refreshData);
    connection.on("BookingUpdated", refreshData);
     return () => {
      connection.off("BookingCreated", refreshData);
      connection.off("BookingCancelled", refreshData);
      connection.off("BookingDeleted", refreshData);
      connection.off("BookingUpdated", refreshData);
      connection.stop();
    };
  }, [token, hubUrl]);

  const handleCancel = async (bookingId: number) => {
    if (!token) return;
    try {
      await cancelBooking(token, bookingId);
      toast.success("Bokning avbokad!");

      const [newMyBookings] = await Promise.all([fetchMyBookings(token)]);
      setMyBookings(newMyBookings);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Kunde inte avboka");
    }
  };

  const activeSorted = useMemo(
    () =>
      myBookings
        .filter((b) => b.isActive)
        .sort(
          (a, b) =>
            new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
        ),
    [myBookings]
  );

  if (loading) return <p className="text-gray-600">Loading bookings...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">My bookings</h1>
      <br />

      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 400px))",
          justifyContent: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {activeSorted.map((b) => (
          <MyBookingCard key={b.bookingId} booking={b} onCancel={handleCancel} />
        ))}
      </div>

      {activeSorted.length === 0 ? (
        <p className="text-center">You have no active bookings.</p>
      ) : null}
    </div>
  );
};

export default MyBookings;