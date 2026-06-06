const DEFAULT_BOUNDS = {
  minLat: 48.855,
  maxLat: 48.868,
  minLng: 2.342,
  maxLng: 2.353,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function getMapPosition(lat, lng, bounds) {
  const latPct = (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat);
  const lngPct = (lng - bounds.minLng) / (bounds.maxLng - bounds.minLng);
  return {
    top: `${100 - clamp(latPct, 0, 1) * 100}%`,
    left: `${clamp(lngPct, 0, 1) * 100}%`,
  };
}

export default function TelemetryMap({ telemetry }) {
  const latestEvent = telemetry[0] || { payload: [] };
  const positions = latestEvent.payload || [];

  return (
    <section className="panel bg-slate-950/90 border-slate-800 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Live vehicle positions</h2>
          <p className="text-sm text-slate-400">Real-time WebSocket updates are shown on the map below.</p>
        </div>
        <div className="rounded-full border border-sky-500/20 bg-slate-900/80 px-4 py-2 text-sm text-sky-200">
          {latestEvent.timestamp ? `Last update: ${new Date(latestEvent.timestamp).toLocaleTimeString()}` : 'Waiting for telemetry'}
        </div>
      </div>

      <div className="map-shell relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-950/90">
        <div className="map-grid absolute inset-0 opacity-40" />
        {positions.map((position) => {
          const coords = getMapPosition(position.latitude, position.longitude, DEFAULT_BOUNDS);
          return (
            <div
              key={`${position.vehicle_id}-${position.recorded_at}`}
              className="marker"
              style={{ top: coords.top, left: coords.left }}
              title={`${position.license_plate} (${position.type})`}
            >
              {position.license_plate.slice(0, 3)}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-300">
        {positions.length === 0 ? (
          <p>No vehicle positions received yet.</p>
        ) : (
          positions.map((position) => (
            <div key={`${position.vehicle_id}-${position.recorded_at}`} className="rounded-2xl bg-slate-900/80 border border-slate-700 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-slate-100">
                <span className="font-medium">{position.license_plate}</span>
                <span className="text-slate-400">{position.type}</span>
              </div>
              <div className="mt-1 grid gap-1 text-slate-300">
                <span>Lat: {position.latitude}</span>
                <span>Lng: {position.longitude}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
