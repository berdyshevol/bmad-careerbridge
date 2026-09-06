'use strict';

// Application stage state machine (ARCH-12, PRD §3). Pure: no I/O, imports
// only ./enums and ../errors. Terminal stages (hired, rejected, withdrawn,
// declined) have no outgoing edges.

const { APPLICATION_STAGE } = require('./enums');
const { InvalidTransitionError } = require('../errors');

// `offer -> rejected` is deliberately absent: FR-R6-3's fill cascade rejects
// every other Active Application, but S3's one-open-offer partial index
// guarantees the hired Application was the only one in `offer`, so the cascade
// only ever moves applied/screening/interview to rejected.
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

// Renders a stored enum value in words for messages ("no_show" -> "no show").
// Unknown-value messages quote the raw value instead.
function spoken(value) {
  return String(value).replace(/_/g, ' ');
}

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
      `An application in stage ${spoken(from)} cannot move to ${spoken(to)}`,
    );
  }
}

module.exports = { APPLICATION_TRANSITIONS, assertTransition };
