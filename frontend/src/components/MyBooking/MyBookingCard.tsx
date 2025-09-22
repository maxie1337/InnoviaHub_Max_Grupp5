import type { Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ResourceCardProps {
  booking: Booking;
  onCancel: (bookingId: number) => void;
}

export default function MyBookingCard({ booking, onCancel }: ResourceCardProps) {
  const [startDateString, setStartString] = useState("");
  const [endDateString, setEndString] = useState("");

  function createDateStrings() {
    let startDate = new Date(booking.bookingDate).toLocaleString();
    let endDate = new Date(booking.endDate).toLocaleString();

    startDate = startDate.substring(0, startDate.length - 3);
    endDate = endDate.substring(0, endDate.length - 3);

    setStartString(startDate);
    setEndString(endDate);
  }

  useEffect(() => {
    createDateStrings();
  }, []);

  //
  let badgeText = "My Booking";
  let badgeStyle = "bg-blue-100 text-blue-800";

  if (!booking.isActive) {
    badgeText = "Cancelled";
    badgeStyle = "bg-gray-100 text-gray-800";
  }

  return (
    <div className="rounded-lg p-4 flex flex-col justify-between bg-white border border-gray-200 shadow-sm">

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{booking.resource.name}</h3>
        <span
          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${badgeStyle}`}
        >
          {badgeText}
        </span>
      </div>

      <p className="text-sm mb-4">
        {startDateString} – {endDateString}
      </p>

      {booking.isActive && (
        <Button
          onClick={() => onCancel(booking.bookingId)}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Avboka
        </Button>
      )}
    </div>
  );
}