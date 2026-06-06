
import { useEffect, useMemo, useState } from 'react';
import { graphqlRequest, TELEMETRY_URL } from './api/graphql';
import {
  VEHICLES_QUERY,
  ZONES_QUERY,
  INCIDENTS_QUERY,
  NOTIFICATIONS_QUERY,
} from './graphql/queries';

import AuthPanel from './components/AuthPanel';
import UserHeader from './components/UserHeader';
import StatsGrid from './components/StatsGrid';
import TrafficZonesPanel from './components/TrafficZonesPanel';
import IncidentsPanel from './components/IncidentsPanel';
import VehiclesPanel from './components/VehiclesPanel';
import NotificationsPanel from './components/NotificationsPanel';
import TelemetryMap from './components/TelemetryMap';
import ActionForms from './components/ActionForms';

function App() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [zones, setZones] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [wsStatus, setWsStatus] = useState('connecting');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [authMode, setAuthMode] = useState('login');
  const [authInput, setAuthInput] = useState({ email: '', password: '', role: 'OPERATOR' });
  const [vehicleInput, setVehicleInput] = useState({ license_plate: '', type: '', model: '' });
  const [positionInput, setPositionInput] = useState({ vehicle_id: '', latitude: '', longitude: '' });
  const [zoneInput, setZoneInput] = useState({ name: '', region: '' });
  const [trafficInput, setTrafficInput] = useState({ zoneId: '', vehicleCount: '' });
  const [incidentInput, setIncidentInput] = useState({ type: 'Accident', location: '', description: '' });
  const [incidentStatusInput, setIncidentStatusInput] = useState({ id: '', status: 'Signale' });
  const [notificationInput, setNotificationInput] = useState({ recipient: '', message: '' });

  useEffect(() => {
    const storedToken = localStorage.getItem('trafficDashboardToken');
    const storedUser = localStorage.getItem('trafficDashboardUser');
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('trafficDashboardToken', token);
    } else {
      localStorage.removeItem('trafficDashboardToken');
    }
    if (user) {
      localStorage.setItem('trafficDashboardUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('trafficDashboardUser');
    }
  }, [token, user]);

  const fetchAll = async () => {
    setError(null);
    try {
      const [vehiclesData, zonesData, incidentsData, notificationsData] = await Promise.all([
        graphqlRequest(VEHICLES_QUERY, {}, token),
        graphqlRequest(ZONES_QUERY, {}, token),
        graphqlRequest(INCIDENTS_QUERY, {}, token),
        graphqlRequest(NOTIFICATIONS_QUERY, {}, token),
      ]);

      setVehicles(vehiclesData.vehicles);
      setZones(zonesData.trafficZones);
      setIncidents(incidentsData.incidents);
      setNotifications(notificationsData.notifications);
    } catch (fetchError) {
      setError(fetchError.message);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [token]);

  useEffect(() => {
    const socket = new WebSocket(TELEMETRY_URL);

    socket.addEventListener('open', () => setWsStatus('connected'));
    socket.addEventListener('message', (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'vehiclePositionUpdate') {
          setTelemetry((current) => [payload, ...current].slice(0, 10));
        }
      } catch (parseError) {
        console.error('Telemetry parse error', parseError);
      }
    });
    socket.addEventListener('close', () => setWsStatus('disconnected'));
    socket.addEventListener('error', () => setWsStatus('error'));

    return () => socket.close();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const operation = authMode === 'login' ? 'login' : 'register';
      const query = `mutation ${operation === 'login' ? 'Login' : 'Register'}($input: ${
        operation === 'login' ? 'LoginInput!' : 'RegisterInput!'
      }) { ${operation}(input: $input) { token user { id email role created_at } } }`;

      const input =
        operation === 'login'
          ? { email: authInput.email, password: authInput.password }
          : authInput;

      const variables = { input };
      const data = await graphqlRequest(query, variables, token);
      const authResult = data[operation];

      setToken(authResult.token);
      setUser(authResult.user);
      showMessage(`${operation === 'login' ? 'Logged in' : 'Registered'} successfully`);
      setAuthInput({ email: '', password: '', role: 'OPERATOR' });
      await fetchAll();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleMutation = async (query, variables, successMessage) => {
    setError(null);
    try {
      await graphqlRequest(query, variables, token);
      showMessage(successMessage);
      await fetchAll();
    } catch (mutationError) {
      setError(mutationError.message);
    }
  };

  const handleAddVehicle = (event) => {
    event.preventDefault();
    handleMutation(
      `mutation AddVehicle($input: VehicleInput!) { addVehicle(input: $input) { id } }`,
      { input: vehicleInput },
      'Vehicle added'
    );
    setVehicleInput({ license_plate: '', type: '', model: '' });
  };

  const handleAddPosition = (event) => {
    event.preventDefault();
    handleMutation(
      `mutation AddPosition($input: PositionInput!) { addPosition(input: $input) { id } }`,
      {
        input: {
          vehicle_id: positionInput.vehicle_id,
          latitude: Number(positionInput.latitude),
          longitude: Number(positionInput.longitude),
        },
      },
      'Position added'
    );
    setPositionInput({ vehicle_id: '', latitude: '', longitude: '' });
  };

  const handleAddZone = (event) => {
    event.preventDefault();
    handleMutation(
      `mutation CreateZone($input: TrafficZoneInput!) { createTrafficZone(input: $input) { id } }`,
      { input: zoneInput },
      'Traffic zone created'
    );
    setZoneInput({ name: '', region: '' });
  };

  const handleMeasureTraffic = (event) => {
    event.preventDefault();
    handleMutation(
      `mutation MeasureTraffic($zoneId: ID!, $vehicleCount: Int!) { measureTraffic(zoneId: $zoneId, vehicleCount: $vehicleCount) { id } }`,
      { zoneId: trafficInput.zoneId, vehicleCount: Number(trafficInput.vehicleCount) },
      'Traffic measured'
    );
    setTrafficInput({ zoneId: '', vehicleCount: '' });
  };

  const handleDeclareIncident = (event) => {
    event.preventDefault();
    handleMutation(
      `mutation DeclareIncident($input: IncidentInput!) { declareIncident(input: $input) { id } }`,
      { input: incidentInput },
      'Incident declared'
    );
    setIncidentInput({ type: 'Accident', location: '', description: '' });
  };

  const handleUpdateIncidentStatus = (event) => {
    event.preventDefault();
    handleMutation(
      `mutation UpdateIncidentStatus($input: IncidentStatusInput!) { updateIncidentStatus(input: $input) { id } }`,
      { input: { id: incidentStatusInput.id, status: incidentStatusInput.status } },
      'Incident status updated'
    );
    setIncidentStatusInput({ id: '', status: 'Signale' });
  };

  const handleSendNotification = (event) => {
    event.preventDefault();
    handleMutation(
      `mutation SendNotification($input: NotificationInput!) { sendNotification(input: $input) { id } }`,
      { input: notificationInput },
      'Notification sent'
    );
    setNotificationInput({ recipient: '', message: '' });
  };

  const handleMarkNotificationRead = async (id) => {
    await handleMutation(
      `mutation MarkRead($id: ID!) { markNotificationRead(id: $id) { id } }`,
      { id },
      'Notification marked read'
    );
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    showMessage('Logged out');
  };

  const stats = useMemo(
    () => [
      { label: 'Vehicles', value: vehicles.length },
      { label: 'Zones', value: zones.length },
      { label: 'Incidents', value: incidents.length },
      { label: 'Notifications', value: notifications.length },
    ],
    [vehicles.length, zones.length, incidents.length, notifications.length]
  );

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <h1>Urban Traffic Dashboard</h1>
          <p>{token ? 'Manage vehicles, zones, incidents, and notifications.' : 'Login to access the dashboard'}</p>
        </div>
        {token && <div className={`status-pill status-${wsStatus}`}>Telemetry: {wsStatus}</div>}
      </header>

      {error && <div className="error-banner">{error}</div>}
      {message && <div className="message-banner">{message}</div>}

      {!token ? (
        <AuthPanel
          authMode={authMode}
          authInput={authInput}
          setAuthMode={setAuthMode}
          setAuthInput={setAuthInput}
          handleAuthSubmit={handleAuthSubmit}
        />
      ) : (
        <>
          <UserHeader user={user} handleLogout={handleLogout} wsStatus={wsStatus} />
          <StatsGrid stats={stats} />
          <TelemetryMap telemetry={telemetry} />
          <TrafficZonesPanel zones={zones} />
          <IncidentsPanel incidents={incidents} />
          <VehiclesPanel vehicles={vehicles} />
          <NotificationsPanel notifications={notifications} handleMarkNotificationRead={handleMarkNotificationRead} />
          <ActionForms
            vehicleInput={vehicleInput}
            setVehicleInput={setVehicleInput}
            positionInput={positionInput}
            setPositionInput={setPositionInput}
            zoneInput={zoneInput}
            setZoneInput={setZoneInput}
            trafficInput={trafficInput}
            setTrafficInput={setTrafficInput}
            incidentInput={incidentInput}
            setIncidentInput={setIncidentInput}
            incidentStatusInput={incidentStatusInput}
            setIncidentStatusInput={setIncidentStatusInput}
            notificationInput={notificationInput}
            setNotificationInput={setNotificationInput}
            vehicles={vehicles}
            zones={zones}
            incidents={incidents}
            handleAddVehicle={handleAddVehicle}
            handleAddPosition={handleAddPosition}
            handleAddZone={handleAddZone}
            handleMeasureTraffic={handleMeasureTraffic}
            handleDeclareIncident={handleDeclareIncident}
            handleUpdateIncidentStatus={handleUpdateIncidentStatus}
            handleSendNotification={handleSendNotification}
          />
        </>
      )}
    </div>
  );
}

export default App;
