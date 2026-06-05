const { trafficZoneSchema } = require('../../utils/validation');

const calculateLevel = (vehicleCount) => {
  if (vehicleCount >= 50) return 'Élevé';
  if (vehicleCount >= 20) return 'Moyen';
  return 'Faible';
};

const TrafficResolvers = {
  Query: {
    trafficZones: async (_, __, { db }) => db('traffic_zones').select('*'),
    trafficZone: async (_, { id }, { db }) => db('traffic_zones').where({ id }).first(),
  },
  Mutation: {
    createTrafficZone: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      const { error, value } = trafficZoneSchema.validate(input, { stripUnknown: true });
      if (error) {
        throw new Error(error.message);
      }
      const [zone] = await db('traffic_zones')
        .insert({
          name: value.name,
          region: value.region,
          vehicle_count: 0,
          congestion_level: 'Faible',
        })
        .returning(['id', 'name', 'region', 'vehicle_count', 'congestion_level', 'created_at']);
      return zone;
    },
    measureTraffic: async (_, { zoneId, vehicleCount }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      const zone = await db('traffic_zones').where({ id: zoneId }).first();
      if (!zone) {
        throw new Error('Traffic zone not found');
      }
      const congestion_level = calculateLevel(vehicleCount);
      const [updatedZone] = await db('traffic_zones')
        .where({ id: zoneId })
        .update({ vehicle_count: vehicleCount, congestion_level })
        .returning(['id', 'name', 'region', 'vehicle_count', 'congestion_level', 'created_at']);
      return updatedZone;
    },
  },
};

module.exports = TrafficResolvers;
