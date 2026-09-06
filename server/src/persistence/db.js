'use strict';

// The only file that may require('knex') (ARCH-03). Story 1.4 adds
// withTransaction to this same file; it does not exist yet.

const knex = require('knex');
const knexConfig = require('../../knexfile');

const db = knex(knexConfig);
const pool = db.client.pool;

async function ping() {
  await db.raw('select 1');
}

module.exports = { db, pool, ping };
