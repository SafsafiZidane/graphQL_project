const { vehicleSchema } = require('../../utils/validation');

const VehicleResolvers = {
  Query: {
    vehicles: async (_, __, { db }) => db('vehicles').select('*'),
    vehicle: async (_, { id }, { db }) => db('vehicles').where({ id }).first(),
    vehicleHistory: async (_, { vehicle_id }, { db }) =>
      db('vehicle_positions').where({ vehicle_id }).orderBy('recorded_at', 'desc'),
  },
  Mutation: {
    addVehicle: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      const { error, value } = vehicleSchema.validate(input, { stripUnknown: true });
      if (error) {
        throw new Error(error.message);
      }
      const [vehicle] = await db('vehicles')
        .insert(value)
        .returning(['id', 'license_plate', 'type', 'model', 'status', 'created_at']);
      return vehicle;
    },
    addPosition: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      const vehicle = await db('vehicles').where({ id: input.vehicle_id }).first();
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      const [position] = await db('vehicle_positions')
        .insert({
          vehicle_id: input.vehicle_id,
          latitude: input.latitude,
          longitude: input.longitude,
        })
        .returning(['id', 'vehicle_id', 'latitude', 'longitude', 'recorded_at']);
      return position;
    },
  },
};

module.exports = VehicleResolvers;
