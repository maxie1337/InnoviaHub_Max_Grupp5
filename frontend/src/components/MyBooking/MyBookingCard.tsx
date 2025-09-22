import type { Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ResourceCardProps {
  booking: Booking;
  onCancel: (bookingId: number) => void;
}

export default function MyBookingCard({ booking, onCancel }: ResourceCardProps) {
  const [bookingString, setBookingString] = useState("");

  useEffect(() => 
  {
    var date = new Date(booking.bookingDate);
    var string = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setBookingString(string);
  }, [])

  return (
    <div className="rounded-lg p-4 flex flex-col">
      <div>
        <h3 className="text-lg font-semibold text-center">{booking.resource.name}</h3>
      </div>

      <p className="text-sm mb-4">
        {bookingString} 
      </p>
      <p className="text-sm mb-4">
        {`${new Date(booking.bookingDate).getHours()}:00-${new Date(booking.endDate).getHours()}:00`}
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