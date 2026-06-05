# GraphQL Test Queries

## Register

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      id
      email
      role
    }
  }
}
```

Variables:

```json
{
  "input": {
    "email": "admin@example.com",
    "password": "Password123",
    "role": "ADMIN"
  }
}
```

## Login

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      email
      role
    }
  }
}
```

## Add vehicle

```graphql
mutation AddVehicle($input: VehicleInput!) {
  addVehicle(input: $input) {
    id
    license_plate
    type
    model
    status
  }
}
```

## Add GPS position

```graphql
mutation AddPosition($input: PositionInput!) {
  addPosition(input: $input) {
    id
    vehicle_id
    latitude
    longitude
    recorded_at
  }
}
```

## Create traffic zone

```graphql
mutation CreateTrafficZone($input: TrafficZoneInput!) {
  createTrafficZone(input: $input) {
    id
    name
    region
    congestion_level
  }
}
```

## Declare incident

```graphql
mutation DeclareIncident($input: IncidentInput!) {
  declareIncident(input: $input) {
    id
    type
    location
    status
    description
  }
}
```

## Send notification

```graphql
mutation SendNotification($input: NotificationInput!) {
  sendNotification(input: $input) {
    id
    recipient
    message
    read
  }
}
```

## Query vehicles

```graphql
query {
  vehicles {
    id
    license_plate
    type
    model
    status
  }
}
```

## Query incidents

```graphql
query {
  incidents {
    id
    type
    location
    status
    description
  }
}
```
