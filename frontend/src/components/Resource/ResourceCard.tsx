import type { Resource } from "@/types/resource";
import type { Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";

//Props that component receives
interface ResourceCardProps {
  resource: Resource;
  allBookings: Booking[];
  myBookings: Booking[];
  onBook: (resourceId: number) => void;
  onCancel: (bookingId: number) => void;
}
//Component for resources
export default function ResourceCard({
  resource,
  allBookings,
  myBookings,
  onBook,
  onCancel,
}: ResourceCardProps) {

  //Checks if resource is already booked
  const booking = allBookings.find(
    (b) => b.resource.resourceId === resource.resourceId && b.isActive
  );

  // True/false if resource is booked
  const isBooked = !!booking;

  //Checks if resource is booked bu logged in user
  const myBooking = myBookings.find(
    (b) => b.resource.resourceId === resource.resourceId && b.isActive
  );

  return (
    <div className="border rounded-lg shadow p-4 flex flex-col justify-between">
      <h3 className="text-lg font-semibold">{resource.name}</h3>
      <p className="text-sm text-gray-500 mb-4">
        {resource.resourceType?.name}
      </p>

      {!isBooked && (
        <Button
          onClick={() => onBook(resource.resourceId)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Boka
        </Button>
      )}

      {myBooking && (
        <Button
          onClick={() => onCancel(myBooking.bookingId)}
          className="bg-red-600 text-white hover:bg-red-700"
        >
          Avboka
        </Button>
      )}

      {isBooked && !myBooking && (
        <span className="text-gray-400 text-sm font-medium">
          Ej tillgänglig
        </span>
      )}
    </div>
  );
}