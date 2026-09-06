'use strict';

// S8 use-case signature: async (actor, input). Keeps the health route out of
// persistence directly, preserving the one-way presentation -> business ->
// persistence flow (NFR-11).

const { ping } = require('../../persistence/db');

module.exports = async function checkHealth(actor, input) {
  await ping();
  return { status: 'ok' };
};
