'use strict';

// Application stage state machine (ARCH-12, PRD §3). Pure: no I/O, imports
// only ./enums and ../errors. Terminal stages (hired, rejected, withdrawn,
// declined) have no outgoing edges.

const { APPLICATION_STAGE } = require('./enums');
const { InvalidTransitionError } = require('../errors');

const APPLICATION_TRANSITIONS = Object.freeze({
  applied: Object.freeze(['screening', 'rejected', 'withdrawn']),
  screening: Object.freeze(['interview', 'rejected', 'withdrawn']),
  interview: Object.freeze(['offer', 'rejected', 'withdrawn']),
  offer: Object.freeze(['hired', 'declined']),
  hired: Object.freeze([]),
  rejected: Object.freeze([]),
  withdrawn: Object.freeze([]),
  declined: Object.freeze([]),
});

function assertKnownStage(value) {
  if (!APPLICATION_STAGE.includes(value)) {
    throw new InvalidTransitionError(`Unknown application stage "${value}"`);
  }
}

/**
 * Throws InvalidTransitionError unless `from -> to` is an edge of
 * APPLICATION_TRANSITIONS. Returns undefined when the move is allowed.
 */
function assertTransition(from, to) {
  assertKnownStage(from);
  assertKnownStage(to);
  if (!APPLICATION_TRANSITIONS[from].includes(to)) {
    throw new InvalidTransitionError(
      `An application in stage ${from} cannot move to ${to}`,
    );
  }
}

module.exports = { APPLICATION_TRANSITIONS, assertTransition };
