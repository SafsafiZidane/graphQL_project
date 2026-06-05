const { gql } = require('apollo-server-express');

module.exports = gql`
  enum Role {
    ADMIN
    OPERATOR
  }

  enum IncidentType {
    Accident
    Travaux
    RouteFermee
    Embouteillage
  }

  enum IncidentStatus {
    Signale
    EnCours
    Resolu
  }

  enum CongestionLevel {
    Faible
    Moyen
    Eleve
  }

  type User {
    id: ID!
    email: String!
    role: Role!
    created_at: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Vehicle {
    id: ID!
    license_plate: String!
    type: String!
    model: String!
    status: String!
    created_at: String!
  }

  type VehiclePosition {
    id: ID!
    vehicle_id: ID!
    latitude: Float!
    longitude: Float!
    recorded_at: String!
  }

  type TrafficZone {
    id: ID!
    name: String!
    region: String!
    vehicle_count: Int!
    congestion_level: String!
    created_at: String!
  }

  type Incident {
    id: ID!
    type: String!
    location: String!
    status: String!
    description: String
    reported_at: String!
  }

  type Notification {
    id: ID!
    recipient: String!
    message: String!
    read: Boolean!
    sent_at: String!
  }

  input RegisterInput {
    email: String!
    password: String!
    role: Role = OPERATOR
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input VehicleInput {
    license_plate: String!
    type: String!
    model: String!
  }

  input PositionInput {
    vehicle_id: ID!
    latitude: Float!
    longitude: Float!
  }

  input TrafficZoneInput {
    name: String!
    region: String!
  }

  input IncidentInput {
    type: IncidentType!
    location: String!
    description: String
  }

  input IncidentStatusInput {
    id: ID!
    status: IncidentStatus!
  }

  input NotificationInput {
    recipient: String!
    message: String!
  }

  type Query {
    me: User
    vehicles: [Vehicle!]!
    vehicle(id: ID!): Vehicle
    vehicleHistory(vehicle_id: ID!): [VehiclePosition!]!
    trafficZones: [TrafficZone!]!
    trafficZone(id: ID!): TrafficZone
    incidents: [Incident!]!
    incident(id: ID!): Incident
    notifications(recipient: String): [Notification!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    addVehicle(input: VehicleInput!): Vehicle!
    addPosition(input: PositionInput!): VehiclePosition!

    createTrafficZone(input: TrafficZoneInput!): TrafficZone!
    measureTraffic(zoneId: ID!, vehicleCount: Int!): TrafficZone!

    declareIncident(input: IncidentInput!): Incident!
    updateIncidentStatus(input: IncidentStatusInput!): Incident!

    sendNotification(input: NotificationInput!): Notification!
    markNotificationRead(id: ID!): Notification!
  }
`;
