import { useEffect } from "react";
import { getBookingHubConnection } from "./hubConnection";


export function useBookingHub(token?: string, onEvent?: () => void) {
  useEffect(() => {
    if (!token) return;

    const connection = getBookingHubConnection(token);

    const start = async () => {
      try {
        if (connection.state === "Disconnected") {
          await connection.start();
          console.log("[Hub] SignalR ansluten");
        }

        const refresh = () => {
          console.log("[Hub] Mottog uppdatering från servern");
          onEvent && onEvent();
        };

        connection.on("BookingCreated", refresh);
        connection.on("BookingCancelled", refresh);
        connection.on("BookingUpdated", refresh);
        connection.on("BookingDeleted", refresh);
      } catch (err) {
        console.error("[Hub] Start error:", err);
        setTimeout(start, 5000);
      }
    };

    start();
    return () => {
        console.log("CLEAN IT UP DUDE")
        connection.off("BookingCreated");
        connection.off("BookingCancelled");
        connection.off("BookingUpdated");
        connection.off("BookingDeleted");
    };
  }, [token, onEvent]);
}