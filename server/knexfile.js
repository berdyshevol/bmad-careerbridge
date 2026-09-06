'use strict';

// Reads the connection string from ./src/config, never process.env directly
// (ARCH-02, ARCH-20).
const config = require('./src/config');

module.exports = {
  client: 'pg',
  connection: config.databaseUrl,
  pool: { min: 0, max: 10 },
  migrations: {
    directory: './src/data/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './src/data/seeds',
  },
};
