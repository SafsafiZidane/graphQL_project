# Urban Traffic Management Backend

A Node.js + Express + GraphQL backend for urban traffic supervision, vehicle tracking, incident management, and notification delivery.

## Features

- Authentication with JWT and role-based access
- Vehicle registry and GPS position history
- Traffic zone modeling and congestion classification
- Incident reporting and status workflow
- Notification management
- PostgreSQL persistence
- GraphQL API gateway using Apollo Server
- Docker Compose support for local development

## Getting started

1. Copy `.env.example` to `.env` and update env values.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start PostgreSQL and backend locally with Docker compose:
   ```bash
   docker compose up --build
   ```
4. Run database setup:
   ```bash
   npm run db:setup
   ```
5. Open GraphQL playground at `http://localhost:4000/graphql`.

## React dashboard

Start the frontend dashboard:

```bash
cd frontend
npm install
npm run dev
```

Then open the dashboard at `http://localhost:5173`.

If you use Docker Compose, start all services together:

```bash
docker compose up --build
```

The backend GraphQL API will run on `http://localhost:4000/graphql` and the telemetry websocket will be available at `ws://localhost:4000/telemetry`.

## Available scripts

- `npm start` - start production server
- `npm run dev` - start development server with nodemon
- `npm run db:setup` - create database schema if missing

## GraphQL samples

See `GRAPHQL_QUERIES.md` for ready-to-use GraphQL operations and variable examples.

## Project structure

- `src/server.js` - app entrypoint
- `src/app.js` - Express + Apollo setup
- `src/graphql` - GraphQL type definitions and resolvers
- `src/modules` - domain services and repositories
- `src/db` - database connection and bootstrap logic
- `src/middleware` - auth and error handling

## Notes

This backend is designed to support a full traffic management platform and can be extended with a frontend React/Next.js dashboard, WebSocket telemetry, and tests.
