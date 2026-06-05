const http = require('http');
const { app, startApollo } = require('./app');
const config = require('./config');
const { startTelemetry } = require('./telemetry');
const db = require('./db/knex');
const { initializeDatabase } = require('./db/initDb');

const port = config.port || 4000;
const server = http.createServer(app);

async function start() {
  await initializeDatabase();
  await startApollo();
  await startTelemetry(server, db);
  server.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}/graphql`);
    console.log(`📡 WebSocket telemetry available at ws://localhost:${port}/telemetry`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
