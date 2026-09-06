'use strict';

// The sole reader of `process.env` under server/src/ (S11, ARCH-16). Every
// other module receives configuration through this file's frozen export.

const path = require('path');
const pino = require('pino');

// Load the repository-root .env explicitly (not the process cwd): `npm run
// dev -w server`, `knex migrate:latest` (cwd server/), and `node
// server/src/index.js` (cwd repo root) must all resolve the same file.
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

class MissingConfigError extends Error {
  constructor(missingNames) {
    super(`Missing required environment variables: ${missingNames.join(', ')}`);
    this.name = 'MissingConfigError';
    this.missingNames = missingNames;
  }
}

const REQUIRED = ['DATABASE_URL', 'SESSION_SECRET'];

function assertRequired(env) {
  const missing = REQUIRED.filter((name) => !env[name]);
  if (missing.length > 0) {
    throw new MissingConfigError(missing);
  }
}

assertRequired(process.env);

// Number(x) || default silently swaps an explicit "0" or a typo'd value
// (e.g. PORT=abc) for the default. Parse explicitly and fail loudly instead,
// matching the fail-fast treatment given the required variables above.
function parseNumericEnv(name, defaultValue) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') {
    return defaultValue;
  }
  const value = Number(raw);
  if (Number.isNaN(value)) {
    throw new Error(`Invalid numeric value for ${name}: ${JSON.stringify(raw)}`);
  }
  return value;
}

const nodeEnv = process.env.NODE_ENV || 'development';

const logger = pino({
  level: nodeEnv === 'test' ? 'silent' : 'info',
  redact: ['req.headers.cookie', 'req.headers.authorization', 'password', 'passwordHash'],
});

const config = Object.freeze({
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET,
  sessionIdleHours: parseNumericEnv('SESSION_IDLE_HOURS', 8),
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  resumeMaxBytes: parseNumericEnv('RESUME_MAX_BYTES', 2097152),
  tz: process.env.TZ || 'America/Chicago',
  seedDemo: process.env.SEED_DEMO === 'true',
  port: parseNumericEnv('PORT', 3000),
  nodeEnv,
  isProduction: nodeEnv === 'production',
  logger,
  MissingConfigError,
});

module.exports = config;
