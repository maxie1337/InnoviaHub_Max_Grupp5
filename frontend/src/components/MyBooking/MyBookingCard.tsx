import type { Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

//Props that component receives
interface ResourceCardProps 
{
  booking: Booking;
  onCancel: (bookingId: number) => void;
}

export default function MyBookingCard({booking, onCancel}: ResourceCardProps)
{
    const [startDateString, setStartString] = useState("");
    const [endDateString, setEndString] = useState("");

    function createDateStrings()
    {
        var startDate = new Date(booking.bookingDate).toLocaleString();
        var endDate = new Date(booking.endDate).toLocaleString();

        startDate = startDate.substring(0, startDate.length - 3);
        endDate = endDate.substring(0, endDate.length - 3);

        setStartString(startDate);
        setEndString(endDate);
    }

    useEffect(() => 
    {
        createDateStrings();
    }, [])

    return (
        <div className="border rounded-lg shadow p-4 flex flex-col justify-between">
            <h3 className="text-lg font-semibold">{booking.resource.name}</h3>
            
            <p className="text-sm mb-4">
                {startDateString} - {endDateString}
            </p>

            <Button
                onClick={() => onCancel(booking.bookingId)}
                className="bg-red-600 text-white hover:bg-red-700"
            >
                Avboka
            </Button>
        </div>
    );
}