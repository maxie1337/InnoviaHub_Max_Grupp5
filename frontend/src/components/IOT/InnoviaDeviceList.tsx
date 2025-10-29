import { useState } from "react";
import { Wifi } from "lucide-react";
import { useInnoviaDevices } from "@/hooks/iotHook";

export default function InnoviaDeviceList() {
  const { tenant, rows } = useInnoviaDevices();
  const [open, setOpen] = useState(false);

  const Panel = (
    <aside className="w-full max-w-[360px] max-h-[80vh] overflow-y-auto border-l border-gray-200 bg-white p-4 rounded-xl shadow-md relative">

      <button
        onClick={() => setOpen(false)}
        className="absolute top-2 right-2 text-gray-600 text-xl md:hidden"
      >
        ×
      </button>

      {!tenant ? (
        <>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            Enheter för tillfället offline
          </h3>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-3">
                <div className="h-4 w-28 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Sensorer <span className="text-gray-500">– {tenant.name}</span>
            </h3>
          </div>

          <div className="grid gap-2">
            {rows.map(({ device, metrics }) => {
              const temp = metrics?.temperature?.value?.toFixed(1);
              const co2 = metrics?.co2?.value;
              const timestamps = Object.values(metrics || {}).map((m) =>
                new Date(m.time).getTime()
              );
              const latestTime = timestamps.length
                ? new Date(Math.max(...timestamps)).toLocaleTimeString()
                : null;

              return (
                <div
                  key={device.id}
                  className="rounded-lg border border-gray-200 p-3 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {device.model}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-gray-600">
                        Serial: {device.serial}
                      </p>
                    </div>

                    <span className="text-xs leading-5">
                      <span className="mr-2">
                        <span className="text-gray-500">Temp:</span>{" "}
                        <span className="font-mono text-gray-900">
                          {temp ?? "–"}
                          {temp !== undefined ? "°C" : ""}
                        </span>
                      </span>
                      <br />
                      <span>
                        <span className="text-gray-500">CO₂:</span>{" "}
                        <span className="font-mono text-gray-900">
                          {co2 ?? "–"}
                          {co2 !== undefined ? " ppm" : ""}
                        </span>
                      </span>
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Latest reading</span>
                    {latestTime ? (
                      <span className="font-mono text-gray-900">{latestTime}</span>
                    ) : (
                      <span className="text-gray-400">väntar…</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </aside>
  );

  return (
    <>

      <div className="hidden md:block fixed left-8 top-1/2 -translate-y-1/2 z-40">
        {Panel}
      </div>


      <button
        className="md:hidden fixed right-4 bottom-4 bg-gray-900 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50"
        onClick={() => setOpen(true)}
      >
        <Wifi size={22} />
      </button>

      {open && (
        <div className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          {Panel}
        </div>
      )}
    </>
  );
}