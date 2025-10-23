import { useInnoviaDevices } from "@/hooks/iotHook";

export default function InnoviaDeviceList() {
  const { tenant, rows } = useInnoviaDevices();

  if (!tenant) {
    return (
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40">
        <aside className="w-full max-w-[360px] max-h-[80vh] overflow-y-auto border-l border-gray-200 bg-white p-4 rounded-xl shadow-md">
          <h3 className="mb-3 text-lg font-semibold text-gray-900">Laddar sensorer…</h3>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-gray-200 p-3"
              >
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-16 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-40 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40">
      <aside className="w-full max-w-[360px] max-h-[80vh] overflow-y-auto border-l border-gray-200 bg-white p-4 rounded-xl shadow-md">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Sensorer <span className="text-gray-500">– {tenant.name}</span>
          </h3>
        </div>

        <div className="grid gap-2">
          {rows.map(({ device, metrics }) => {
            const temp = metrics?.temperature?.value.toFixed(1);
            const co2 = metrics?.co2?.value;
            const timestamps = Object.values(metrics || {}).map(m =>
              new Date(m.time).getTime()
            );
            const latestTime = timestamps.length
              ? new Date(Math.max(...timestamps)).toLocaleTimeString()
              : null;

            return (
              <div
                key={device.id}
                className="rounded-lg border border-gray-200 p-3 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{device.model}</p>
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
      </aside>
    </div>
  );
}