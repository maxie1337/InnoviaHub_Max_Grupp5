import type { Booking, BookingDTO } from "@/types/booking";

// URL for API
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all bookings for admin/overview
export async function fetchBookings(token: string): Promise<Booking[]> {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldnt get bookings");
  return await res.json();
}

// Get all bookings for logged in user
export async function fetchMyBookings(token: string): Promise<Booking[]> {
  const res = await fetch(`${BASE_URL}/api/bookings/myBookings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldnt get my bookings");
  return await res.json();
}

//Creates a booking for a resource
export async function createBooking(token: string, booking: BookingDTO) {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(booking),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Couldnt create booking");
  }

  return res.json();
}

// Cancels a booking
export async function cancelBooking(token: string, bookingId: number) {
  const res = await fetch(`${BASE_URL}/api/bookings/cancel/${bookingId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldnt cancel booking");
}

//Deletes a booking
export async function deleteBooking(token: string, bookingId: number) {
  const res = await fetch(`${BASE_URL}/api/bookings/delete/${bookingId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Couldnt delete bookings");
}

export async function getResourcesByDate(token: string,date: string,filter?: string)
: Promise<Record<string, string[]>> 
{
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const params = new URLSearchParams({ date });
  if (filter) params.append("filter", filter);

  const res = await fetch(
    `${BASE_URL}/api/bookings/availability/resources?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Kunde inte hämta resurser: ${res.status} - ${text}`);
  }

  return res.json();
}