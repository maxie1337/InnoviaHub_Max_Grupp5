import type { Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";

interface ResourceCardProps {
  booking: Booking;
  onCancel: (bookingId: number) => void;
}

export default function MyBookingCard({ booking, onCancel }: ResourceCardProps) {
  const [startDateString, setStartString] = useState("");
  const [endDateString, setEndString] = useState("");

  function formatSwedish(dateString: string) {
    return new Date(dateString).toLocaleString("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/Stockholm",
    });
  }

  const timeslotLabel = useMemo(() => {
    const sthlmHour = parseInt(
      new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Europe/Stockholm",
        hour: "2-digit",
        hour12: false,
      }).format(new Date(booking.bookingDate)),
      10
    );
    return sthlmHour < 12 ? "Morning (08–12)" : "Afternoon (12–16)";
  }, [booking.bookingDate]);

  useEffect(() => {
    setStartString(formatSwedish(booking.bookingDate));
    setEndString(formatSwedish(booking.endDate));
  }, [booking.bookingDate, booking.endDate, booking.isActive]);

  let badgeText = booking.isActive ? "My Booking" : "Cancelled";
  let badgeStyle = booking.isActive ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";

  const dateOnly = new Date(booking.bookingDate).toLocaleDateString("sv-SE", { timeZone: "Europe/Stockholm" });

  return (
    <div className="rounded-lg p-4 flex flex-col justify-between bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{booking.resource.name}</h3>
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${badgeStyle}`}>
          {badgeText}
        </span>
      </div>

      <p className="text-sm mb-1">{dateOnly} – {timeslotLabel}</p>

      {booking.isActive && (
        <Button
          onClick={() => onCancel(booking.bookingId)}
          className="mt-4 bg-red-600 text-white hover:bg-red-700"
        >
          Avboka
        </Button>
      )}
    </div>
  );
}