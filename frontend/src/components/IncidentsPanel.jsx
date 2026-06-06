export default function IncidentsPanel({ incidents }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Incidents</h2>
        <span className="panel-count">{incidents.length}</span>
      </div>
      <div className="list-box">
        {incidents.length === 0 ? (
          <div className="empty-state">No incidents reported.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id}>
                  <td>{incident.type}</td>
                  <td>{incident.location}</td>
                  <td>{incident.status}</td>
                  <td>{incident.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
