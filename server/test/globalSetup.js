'use strict';

// Test harness only — not app config. Lives under server/test/, so
// server/src/config.js remains the only process.env reader under
// server/src/ (S11 intact; Design Notes C1).
//
// Defaults DATABASE_URL/SESSION_SECRET only when unset so `config.js` never
// throws on a fresh clone with no .env, then probes the database once and
// sets process.env.DB_AVAILABLE ('true' | 'false'), which Jest propagates
// from the main process to workers. CI must never go vacuously green: when
// CI=true and the probe fails, this throws instead of skipping.

const { Client } = require('pg');

const DEFAULT_DATABASE_URL =
  'postgres://careerbridge:careerbridge@localhost:5432/careerbridge_test';
const DEFAULT_SESSION_SECRET = 'test-session-secret';

module.exports = async function globalSetup() {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
  }
  if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = DEFAULT_SESSION_SECRET;
  }

  const connectionString = process.env.DATABASE_URL;
  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 3000,
    query_timeout: 3000,
  });

  let connected = false;
  try {
    await client.connect();
    connected = true;
    await client.query('SELECT 1');
    process.env.DB_AVAILABLE = 'true';
  } catch (err) {
    process.env.DB_AVAILABLE = 'false';
    const host = safeHost(connectionString);
    console.warn(
      `SKIP NFR-7 database tests: no reachable Postgres at ${host}. Run \`npm run db:up\` and set DATABASE_URL in .env.`
    );
    if (process.env.CI === 'true') {
      throw new Error(
        `Database probe failed in CI (host: ${host}); refusing to run a vacuously green suite: ${err.message}`
      );
    }
  } finally {
    if (connected) {
      await client.end();
    }
  }
};

function safeHost(connectionString) {
  try {
    return new URL(connectionString).host;
  } catch {
    return 'unknown host';
  }
}
