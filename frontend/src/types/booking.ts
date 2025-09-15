export interface Booking {
  bookingId: number;
  bookingDate: string;
  endDate: string;
  isActive: boolean;

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