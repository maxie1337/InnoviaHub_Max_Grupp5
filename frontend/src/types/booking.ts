export interface Booking {
  bookingId: number;
  bookingDate: string;
  endDate: string;
  isActive: boolean;
  timeslot: "FM" | "EF";

  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };

  userId?: string;

  resource: {
    resourceId: number;
    name: string;
    isBooked: boolean;
    resourceType?: {
      resourceTypeId: number;
      name: string;
    };
  };
}

export interface BookingDTO {
  resourceId: number;
  bookingDate: string;
  timeslot: "FM" | "EF";
}