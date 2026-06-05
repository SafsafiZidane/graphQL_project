const { incidentSchema } = require('../../utils/validation');

const IncidentResolvers = {
  Query: {
    incidents: async (_, __, { db }) => db('incidents').select('*').orderBy('reported_at', 'desc'),
    incident: async (_, { id }, { db }) => db('incidents').where({ id }).first(),
  },
  Mutation: {
    declareIncident: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      const typeMap = {
        Accident: 'Accident',
        Travaux: 'Travaux',
        RouteFermee: 'Route fermée',
        Embouteillage: 'Embouteillage',
      };

      const parsedInput = {
        type: typeMap[input.type],
        location: input.location,
        description: input.description || '',
      };
      const { error, value } = incidentSchema.validate(parsedInput, { stripUnknown: true });
      if (error) {
        throw new Error(error.message);
      }
      const [incident] = await db('incidents')
        .insert({ ...value, status: 'Signalé' })
        .returning(['id', 'type', 'location', 'status', 'description', 'reported_at']);
      return incident;
    },
    updateIncidentStatus: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }
      const statusMap = {
        Signale: 'Signalé',
        EnCours: 'En cours',
        Resolu: 'Résolu',
      };
      const incident = await db('incidents').where({ id: input.id }).first();
      if (!incident) {
        throw new Error('Incident not found');
      }
      const status = statusMap[input.status];
      const [updatedIncident] = await db('incidents')
        .where({ id: input.id })
        .update({ status })
        .returning(['id', 'type', 'location', 'status', 'description', 'reported_at']);
      return updatedIncident;
    },
  },
};

module.exports = IncidentResolvers;
