export default function VehiclesPanel({ vehicles }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Vehicles</h2>
        <span className="panel-count">{vehicles.length}</span>
      </div>
      <div className="list-box">
        {vehicles.length === 0 ? (
          <div className="empty-state">No vehicles yet.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Plate</th>
                <th>Type</th>
                <th>Model</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.license_plate}</td>
                  <td>{vehicle.type}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.status || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
