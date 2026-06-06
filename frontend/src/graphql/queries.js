export const VEHICLES_QUERY = `
  query GetVehicles {
    vehicles { id license_plate type model status created_at }
  }
`;

export const ZONES_QUERY = `
  query GetZones {
    trafficZones { id name region vehicle_count congestion_level created_at }
  }
`;

export const INCIDENTS_QUERY = `
  query GetIncidents {
    incidents { id type location status description reported_at }
  }
`;

export const NOTIFICATIONS_QUERY = `
  query GetNotifications {
    notifications { id recipient message read sent_at }
  }
`;
