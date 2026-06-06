export default function TrafficZonesPanel({ zones }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Traffic zones</h2>
        <span className="panel-count">{zones.length}</span>
      </div>
      <div className="list-box">
        {zones.length === 0 ? (
          <div className="empty-state">No traffic zones yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Region</th>
                <th>Vehicles</th>
                <th>Congestion</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((zone) => (
                <tr key={zone.id}>
                  <td>{zone.name}</td>
                  <td>{zone.region}</td>
                  <td>{zone.vehicle_count ?? '—'}</td>
                  <td>{zone.congestion_level ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
