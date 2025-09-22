import type { Resource } from "@/types/resource";
import type { Booking } from "@/types/booking";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CalendarComponent from "@/components/Calender/calenderComponent";
import toast from "react-hot-toast";

//Props needed for resourcecard
interface ResourceCardProps {
  resource: Resource;
  allBookings: Booking[];
  myBookings: Booking[];
  onBook: (resourceId: number, dates: Date[]) => void;
  onCancel: (bookingId: number) => void;
}

export default function ResourceCard({
  resource,
  allBookings,
  myBookings,
  onBook,
  onCancel,
}: ResourceCardProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  // Getting resource if active 
  const booking = allBookings.find(
    (b) => b.resource.resourceId === resource.resourceId && b.isActive
  );

  //Handles the booking confirmation
  const handleConfirmBooking = () => {
      if (!selectedDates || selectedDates.length === 0 || !selectedDates[0]) {
    toast.error("Please choose a date before booking.");
    return;
  }
    if (isDateBooked(selectedDates[0])) {
      alert("This day is already booked, please choose another day.");
      return;
    }
    onBook(resource.resourceId, selectedDates);
    setShowCalendar(false);
  };

  const isBooked = !!booking;

  // checking if its my booking
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

  //Changes color of status depending on your booking, other users or if available
  let badgeText = "Available";
  let badgeStyle = "bg-green-100 text-green-800";

    if (myBooking) {
    badgeText = "Booked by you";
    badgeStyle = "bg-blue-100 text-blue-800";
  } else if (isBooked) {
    badgeText = "Booked";
    badgeStyle = "bg-red-100 text-red-800";
  } else {
    badgeText = "Available";
    badgeStyle = "bg-green-100 text-green-800";
  }

 return (
  <div className="rounded-lg p-4 flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{resource.name}</h3>
      <span
        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${badgeStyle}`}
      >
        {badgeText}
      </span>
    </div>
    <br />

  
    {!isBooked && (
      <>
        <Button onClick={() => setShowCalendar(true)}>Book</Button>
        {showCalendar && (
          <div className="modal-overlay">
            <div className="modal-content">
              <CalendarComponent
                selectedDates={selectedDates}
                setSelectedDates={setSelectedDates}
              />
              <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
              <Button onClick={() => setShowCalendar(false)}>
                Close calender
              </Button>
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
        Cancel
      </Button>
    )}

    {isBooked && !myBooking && (
      <span className="text-gray-400 text-sm font-medium">Not Available</span>
    )}
  </div>
)};