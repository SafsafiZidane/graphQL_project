const authResolver = require('./auth.resolver');
const vehicleResolver = require('./vehicle.resolver');
const trafficResolver = require('./traffic.resolver');
const incidentResolver = require('./incident.resolver');
const notificationResolver = require('./notification.resolver');

module.exports = {
  Query: {
    ...authResolver.Query,
    ...vehicleResolver.Query,
    ...trafficResolver.Query,
    ...incidentResolver.Query,
    ...notificationResolver.Query,
  },
  Mutation: {
    ...authResolver.Mutation,
    ...vehicleResolver.Mutation,
    ...trafficResolver.Mutation,
    ...incidentResolver.Mutation,
    ...notificationResolver.Mutation,
  },
};
