'use strict';

// Health route only (1.1 scope). No listen(), no session, no error handler —
// those land in 1.4/1.5 per the story's Touches.

const express = require('express');
const pinoHttp = require('pino-http');
const { logger } = require('../config');
const checkHealth = require('../business/system/checkHealth');

const app = express();

app.set('trust proxy', 1);
app.use(pinoHttp({ logger }));
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    const result = await checkHealth(null, {});
    res.status(200).json(result);
  } catch (err) {
    req.log.error(err, 'health check failed');
    res.status(503).json({ status: 'error' });
  }
});

module.exports = app;
