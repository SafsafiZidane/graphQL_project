export default function ActionForms({
  vehicleInput,
  setVehicleInput,
  positionInput,
  setPositionInput,
  zoneInput,
  setZoneInput,
  trafficInput,
  setTrafficInput,
  incidentInput,
  setIncidentInput,
  incidentStatusInput,
  setIncidentStatusInput,
  notificationInput,
  setNotificationInput,
  vehicles,
  zones,
  incidents,
  handleAddVehicle,
  handleAddPosition,
  handleAddZone,
  handleMeasureTraffic,
  handleDeclareIncident,
  handleUpdateIncidentStatus,
  handleSendNotification,
}) {
  return (
    <section className="panel full">
      <h2>Actions</h2>
      <div className="forms-grid">
        <form className="action-form" onSubmit={handleAddVehicle}>
          <h3>Add vehicle</h3>
          <label>
            Plate
            <input type="text" value={vehicleInput.license_plate} onChange={(e) => setVehicleInput((prev) => ({ ...prev, license_plate: e.target.value }))} required />
          </label>
          <label>
            Type
            <input type="text" value={vehicleInput.type} onChange={(e) => setVehicleInput((prev) => ({ ...prev, type: e.target.value }))} required />
          </label>
          <label>
            Model
            <input type="text" value={vehicleInput.model} onChange={(e) => setVehicleInput((prev) => ({ ...prev, model: e.target.value }))} required />
          </label>
          <button type="submit">Add vehicle</button>
        </form>

        <form className="action-form" onSubmit={handleAddPosition}>
          <h3>Add vehicle position</h3>
          <label>
            Vehicle
            <select value={positionInput.vehicle_id} onChange={(e) => setPositionInput((prev) => ({ ...prev, vehicle_id: e.target.value }))} required>
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.license_plate}
                </option>
              ))}
            </select>
          </label>
          <label>
            Latitude
            <input type="number" step="0.0001" value={positionInput.latitude} onChange={(e) => setPositionInput((prev) => ({ ...prev, latitude: e.target.value }))} required />
          </label>
          <label>
            Longitude
            <input type="number" step="0.0001" value={positionInput.longitude} onChange={(e) => setPositionInput((prev) => ({ ...prev, longitude: e.target.value }))} required />
          </label>
          <button type="submit">Add position</button>
        </form>

        <form className="action-form" onSubmit={handleAddZone}>
          <h3>Create zone</h3>
          <label>
            Name
            <input type="text" value={zoneInput.name} onChange={(e) => setZoneInput((prev) => ({ ...prev, name: e.target.value }))} required />
          </label>
          <label>
            Region
            <input type="text" value={zoneInput.region} onChange={(e) => setZoneInput((prev) => ({ ...prev, region: e.target.value }))} required />
          </label>
          <button type="submit">Create zone</button>
        </form>

        <form className="action-form" onSubmit={handleMeasureTraffic}>
          <h3>Measure traffic</h3>
          <label>
            Zone
            <select value={trafficInput.zoneId} onChange={(e) => setTrafficInput((prev) => ({ ...prev, zoneId: e.target.value }))} required>
              <option value="">Select zone</option>
              {zones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Vehicle count
            <input type="number" value={trafficInput.vehicleCount} onChange={(e) => setTrafficInput((prev) => ({ ...prev, vehicleCount: e.target.value }))} required />
          </label>
          <button type="submit">Measure</button>
        </form>

        <form className="action-form" onSubmit={handleDeclareIncident}>
          <h3>Declare incident</h3>
          <label>
            Type
            <select value={incidentInput.type} onChange={(e) => setIncidentInput((prev) => ({ ...prev, type: e.target.value }))}>
              <option value="Accident">Accident</option>
              <option value="Travaux">Travaux</option>
              <option value="RouteFermee">Route fermée</option>
              <option value="Embouteillage">Embouteillage</option>
            </select>
          </label>
          <label>
            Location
            <input type="text" value={incidentInput.location} onChange={(e) => setIncidentInput((prev) => ({ ...prev, location: e.target.value }))} required />
          </label>
          <label>
            Description
            <textarea value={incidentInput.description} onChange={(e) => setIncidentInput((prev) => ({ ...prev, description: e.target.value }))} />
          </label>
          <button type="submit">Declare</button>
        </form>

        <form className="action-form" onSubmit={handleUpdateIncidentStatus}>
          <h3>Update incident</h3>
          <label>
            Incident
            <select value={incidentStatusInput.id} onChange={(e) => setIncidentStatusInput((prev) => ({ ...prev, id: e.target.value }))} required>
              <option value="">Select incident</option>
              {incidents.map((incident) => (
                <option key={incident.id} value={incident.id}>
                  {incident.type} - {incident.location}
                </option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select value={incidentStatusInput.status} onChange={(e) => setIncidentStatusInput((prev) => ({ ...prev, status: e.target.value }))}>
              <option value="Signale">Signalé</option>
              <option value="EnCours">En cours</option>
              <option value="Resolu">Résolu</option>
            </select>
          </label>
          <button type="submit">Update status</button>
        </form>

        <form className="action-form" onSubmit={handleSendNotification}>
          <h3>Send notification</h3>
          <label>
            Recipient
            <input type="text" value={notificationInput.recipient} onChange={(e) => setNotificationInput((prev) => ({ ...prev, recipient: e.target.value }))} required />
          </label>
          <label>
            Message
            <textarea value={notificationInput.message} onChange={(e) => setNotificationInput((prev) => ({ ...prev, message: e.target.value }))} required />
          </label>
          <button type="submit">Send notification</button>
        </form>
      </div>
    </section>
  );
}
