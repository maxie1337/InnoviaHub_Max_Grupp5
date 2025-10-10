import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export function getBookingHubConnection(token: string) {
  if (!connection) {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL}/bookingHub`, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    console.log("[Hub] Ny SignalR-anslutning skapad");
  }

  return connection;
}