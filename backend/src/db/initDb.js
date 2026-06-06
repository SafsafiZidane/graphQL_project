const db = require('./knex');

async function createSchema() {
  await db.schema.hasTable('users').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('role').notNullable().defaultTo('OPERATOR');
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
    }
  });

  await db.schema.hasTable('vehicles').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('vehicles', (table) => {
        table.increments('id').primary();
        table.string('license_plate').notNullable().unique();
        table.string('type').notNullable();
        table.string('model').notNullable();
        table.string('status').notNullable().defaultTo('ACTIVE');
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
    }
  });

  await db.schema.hasTable('vehicle_positions').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('vehicle_positions', (table) => {
        table.increments('id').primary();
        table.integer('vehicle_id').unsigned().notNullable().references('id').inTable('vehicles').onDelete('CASCADE');
        table.decimal('latitude', 10, 7).notNullable();
        table.decimal('longitude', 10, 7).notNullable();
        table.timestamp('recorded_at').defaultTo(db.fn.now());
      });
    }
  });

  await db.schema.hasTable('traffic_zones').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('traffic_zones', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('region').notNullable();
        table.integer('vehicle_count').defaultTo(0);
        table.string('congestion_level').defaultTo('Faible');
        table.timestamp('created_at').defaultTo(db.fn.now());
      });
    }
  });

  await db.schema.hasTable('incidents').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('incidents', (table) => {
        table.increments('id').primary();
        table.string('type').notNullable();
        table.string('location').notNullable();
        table.string('status').notNullable().defaultTo('Signalé');
        table.text('description');
        table.timestamp('reported_at').defaultTo(db.fn.now());
      });
    }
  });

  await db.schema.hasTable('notifications').then(async (exists) => {
    if (!exists) {
      await db.schema.createTable('notifications', (table) => {
        table.increments('id').primary();
        table.string('recipient').notNullable();
        table.string('message').notNullable();
        table.boolean('read').defaultTo(false);
        table.timestamp('sent_at').defaultTo(db.fn.now());
      });
    }
  });
}

async function initializeDatabase(retries = 10, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await createSchema();
      console.log('✅ Database schema created or already exists.');
      return;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(`Database not ready yet, retrying (${attempt}/${retries})...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase };
