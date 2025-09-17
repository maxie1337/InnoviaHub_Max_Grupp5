import type { Booking } from "@/types/booking";
import Button from "../Button/Button";

//Props that component receives
interface ResourceCardProps 
{
  booking: Booking;
  onCancel: (bookingId: number) => void;
}
//Component for resources
export default function MyBookingCard({booking, onCancel}: ResourceCardProps)
{
  return (
    <div className="border rounded-lg shadow p-4 flex flex-col justify-between">
        <h3 className="text-lg font-semibold">{booking.resource.name}</h3>
        
        <Button
            onClick={() => onCancel(booking.bookingId)}
            className="bg-red-600 text-white hover:bg-red-700"
        >
            Avboka
        </Button>
    </div>
  );
}