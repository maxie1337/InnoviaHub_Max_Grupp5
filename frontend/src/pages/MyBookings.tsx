import { cancelBooking, fetchMyBookings } from "@/api/bookingApi";
import { UserContext } from "@/context/UserContext";
import type { Booking } from "@/types/booking";
import { useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useBookingHub } from "@/hooks/useBookingHub";
import MyBookingCard from "@/components/MyBooking/MyBookingCard";
import "./MyBookings.css";

const MyBookings: React.FC = () => {
  const { token } = useContext(UserContext);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  //Fetch and setup realtime updates
  useEffect(() => {
    if (!token) return;

    fetchMyBookings(token)
      .then((bookings) => {
        setMyBookings(bookings);
      })
      .catch(() => {
        toast.error("Kunde inte hämta bokningar");
      })
      .finally(() => setLoading(false));
  }, [token]);

   useBookingHub(token, () => {
      console.log("Booking updated - refresh via SignalR");
    });

  //Cancels a booking and refreshes
  const handleCancel = async (bookingId: number) => {
    if (!token) return;
    try {
      await cancelBooking(token, bookingId);
      toast.success("Bokning avbokad!");
      const newBookings = await fetchMyBookings(token);
      setMyBookings(newBookings);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Kunde inte avboka");
    }
  };

  //Sorting active bookings by start date
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