'use strict';

// Posting status state machine (ARCH-12, PRD §3). Pure: no I/O, imports only
// ./enums and ../errors. Keyed over the effective status (S4) so that the
// derived `expired` can be a source; it is never a target.

const { POSTING_STATUS_EFFECTIVE, APPLICATION_STAGE } = require('./enums');
const { InvalidTransitionError } = require('../errors');

const POSTING_TRANSITIONS = Object.freeze({
  draft: Object.freeze(['pending_approval']),
  pending_approval: Object.freeze(['live', 'rejected']),
  live: Object.freeze(['filled', 'closed']),
  filled: Object.freeze([]),
  closed: Object.freeze([]),
  rejected: Object.freeze(['pending_approval']),
  expired: Object.freeze(['filled']),
});

function article(word) {
  return /^[aeiou]/.test(word) ? 'An' : 'A';
}

function assertKnownStatus(value) {
  if (!POSTING_STATUS_EFFECTIVE.includes(value)) {
    throw new InvalidTransitionError(`Unknown posting status "${value}"`);
  }
}

function assertKnownStage(value) {
  if (!APPLICATION_STAGE.includes(value)) {
    throw new InvalidTransitionError(`Unknown application stage "${value}"`);
  }
}

/**
 * Throws InvalidTransitionError unless `from -> to` is an edge of
 * POSTING_TRANSITIONS. `from` is the effective status (S4); `to` is a stored
 * status. Returns undefined when the move is allowed.
 */
function assertTransition(from, to) {
  assertKnownStatus(from);
  assertKnownStatus(to);
  if (!POSTING_TRANSITIONS[from].includes(to)) {
    throw new InvalidTransitionError(
      `${article(from)} ${from} posting cannot become ${to}`,
    );
  }
}

/**
 * FR-R4-4: an Application whose Posting is effectively filled or closed may
 * only be rejected; every other posting status (including expired) allows any
 * stage change. Returns undefined when allowed.
 */
function assertPostingAllows(postingEffectiveStatus, toStage) {
  assertKnownStatus(postingEffectiveStatus);
  assertKnownStage(toStage);
  const blocked = postingEffectiveStatus === 'filled' || postingEffectiveStatus === 'closed';
  if (blocked && toStage !== 'rejected') {
    throw new InvalidTransitionError(
      `${article(postingEffectiveStatus)} ${postingEffectiveStatus} posting does not allow an application to move to ${toStage}; only rejected is allowed`,
    );
  }
}

module.exports = { POSTING_TRANSITIONS, assertTransition, assertPostingAllows };
