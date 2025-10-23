import { useEffect, useMemo, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getTenantBySlug, listDevices } from "@/api/iotApi";
import type { Device } from "@/types/iot";

// Typ av data, co2, temperatur
type Metric = { type: string; value: number; time: string };

// Varje enhet får data
type DeviceMetrics = Record<string, Metric>;

export function useInnoviaDevices() {

  // Hämtar huburl och tenant slug från env fil
  const HUB_URL = import.meta.env.VITE_INNOVIA_HUB_URL as string;
  const TENANT_SLUG = import.meta.env.VITE_INNOVIA_TENANT_SLUG as string;

  // States för tenants, enheter och senaste uppdatering
  const [tenant, setTenant] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [latest, setLatest] = useState<Record<string, DeviceMetrics>>({});
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  // Hämta tenant och enheter från DeviceRegistry
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Hämtar tenant från env fil
        const t = await getTenantBySlug(TENANT_SLUG);
        if (cancelled) return;
        setTenant(t);

        // Hämta alla enheter som är registrerade för tenanten som hämtas
        const list = await listDevices(t.id);
        if (cancelled) return;
        setDevices(list);
      } catch (err) {
        console.error("Failed to load tenants or devices", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [TENANT_SLUG]);

  // Om tenant hittas, så kopplar den upp mot Realtime.Hub och SignalR
  useEffect(() => {
    if (!tenant) return;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = conn;

    // Ny data för enheterna tas emot
    conn.on("measurementReceived", (m: {
      tenantSlug: string;
      deviceId: string;
      type: string;
      value: number;
      time: string;
    }) => {
      // Kollar så att värdet tillhör rätt tenant
      if (m.tenantSlug !== tenant.slug) return;

      // Uppdatera senaste datan för enheter
      setLatest(prev => {
        const prevDevice = prev[m.deviceId] || {};
        return {
          ...prev,
          [m.deviceId]: {
            ...prevDevice,
            [m.type]: { type: m.type, value: m.value, time: m.time },
          },
        };
      });
    });

    // Startar SignalR anslutning och joinar tenants grupp
    (async () => {
      try {
        await conn.start();
        await conn.invoke("JoinTenant", tenant.slug);
        console.log(`Joined SignalR group for tenant '${tenant.slug}'`);
      } catch (err) {
        console.error("SignalR connection error:", err);
      }
    })();

    // Kopplar ifrån vid disconnect
    return () => {
      conn.stop().catch(() => {});
      connectionRef.current = null;
    };
  }, [tenant, HUB_URL]);

  // Sammansätt enheter med data för mätvärden
  const rows = useMemo(() => {
    return devices.map(d => ({
      device: d,
      metrics: latest[d.id] || {},
    }));
  }, [devices, latest]);

  // Skickar tillbaka tenant, enehter och data för dessa
  return { tenant, devices, rows };
}