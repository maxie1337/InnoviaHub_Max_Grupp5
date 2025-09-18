import type { Resource } from "@/types/resource";
import type { Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CalendarComponent from "@/components/Calender/calenderComponent";

//Props that component receives
interface ResourceCardProps {
  resource: Resource;
  allBookings: Booking[];
  myBookings: Booking[];
  onBook: (resourceId: number, dates: Date[]) => void;
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

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  //Checks if resource is already booked
  const booking = allBookings.find(
    (b) => b.resource.resourceId === resource.resourceId && b.isActive
  );

  const handleConfirmBooking = () => {
    if(isDateBooked(selectedDates[0])) {
      alert("Denna dag är redan bokad. Vänligen välj en annan dag.");
      return;
    }
    onBook(resource.resourceId, selectedDates);    
    setShowCalendar(false);
  };

  // True/false if resource is booked
  const isBooked = !!booking;

  //Checks if resource is booked bu logged in user
  const myBooking = myBookings.find(
    (b) => b.resource.resourceId === resource.resourceId && b.isActive
  );
// check if date is booked
  const isDateBooked = (date: Date) => {
    return allBookings.some(
      (b) =>
        b.resource.resourceId === resource.resourceId &&
        b.isActive &&
        new Date(b.bookingDate).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="border rounded-lg shadow p-4 flex flex-col justify-between">
      
      <h3 className="text-lg font-semibold">{resource.name}</h3>
      <p className="text-sm text-gray-500 mb-4">
        {resource.resourceType?.name}
      </p>

      {!isBooked && (
        <>
          <Button onClick={() => setShowCalendar(true)}>Boka</Button>
          {showCalendar && (
            <div className="modal-overlay">
              <div className="modal-content">
                <CalendarComponent
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                />
                <Button onClick={handleConfirmBooking}>Bekräfta bokning</Button>
                <Button onClick={() => setShowCalendar(false)}>Stäng kalender</Button>
              </div>
            </div>
          )}
        </>
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