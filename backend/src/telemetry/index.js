const WebSocket = require('ws');

const randomBetween = (min, max) => Number((Math.random() * (max - min) + min).toFixed(6));

function normalizeLocation(previous) {
  if (!previous) {
    return {
      latitude: randomBetween(48.8566, 48.8666),
      longitude: randomBetween(2.3429, 2.3529),
    };
  }

  return {
    latitude: Number((previous.latitude + randomBetween(-0.0007, 0.0007)).toFixed(6)),
    longitude: Number((previous.longitude + randomBetween(-0.0007, 0.0007)).toFixed(6)),
  };
}

async function startTelemetry(server, db) {
  const wss = new WebSocket.Server({ server, path: '/telemetry' });
  const clients = new Set();
  const lastPositions = new Map();

  wss.on('connection', (socket) => {
    clients.add(socket);
    socket.send(JSON.stringify({ type: 'welcome', message: 'Telemetry channel opened' }));

    socket.on('close', () => {
      clients.delete(socket);
    });
  });

  const broadcast = (payload) => {
    const message = JSON.stringify(payload);
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  };

  const emitPositions = async () => {
    const vehicles = await db('vehicles').select('id', 'license_plate', 'type', 'model', 'status');
    if (!vehicles.length) {
      return;
    }

    const positions = [];
    for (const vehicle of vehicles) {
      const previous = lastPositions.get(vehicle.id);
      const location = normalizeLocation(previous);
      lastPositions.set(vehicle.id, location);

      positions.push({
        vehicle_id: vehicle.id,
        latitude: location.latitude,
        longitude: location.longitude,
        license_plate: vehicle.license_plate,
        type: vehicle.type,
        recorded_at: new Date().toISOString(),
      });
    }

    await db('vehicle_positions').insert(
      positions.map((position) => ({
        vehicle_id: position.vehicle_id,
        latitude: position.latitude,
        longitude: position.longitude,
      }))
    );

    broadcast({
      type: 'vehiclePositionUpdate',
      timestamp: new Date().toISOString(),
      payload: positions,
    });
  };

  setInterval(emitPositions, 5000);

  return Promise.resolve();
}

module.exports = {
  startTelemetry,
};
