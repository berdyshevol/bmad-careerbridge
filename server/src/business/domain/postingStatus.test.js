'use strict';

const { POSTING_STATUS_EFFECTIVE, POSTING_STATUS, APPLICATION_STAGE } = require('./enums');
const { InvalidTransitionError, RuleViolationError } = require('../errors');
const { POSTING_TRANSITIONS, assertTransition, assertPostingAllows } = require('./postingStatus');

// The PRD §3 posting map as a literal table: [from, to, FR IDs]. Every cell of
// the 7×7 effective-status matrix gets one test below; a cell not in this table
// must throw. This file is the NFR-4 evidence for Posting transitions.
const ALLOWED = [
  ['draft', 'pending_approval', 'FR-R2-3'],
  ['rejected', 'pending_approval', 'FR-R2-3'],
  ['pending_approval', 'live', 'FR-M2-2'],
  ['pending_approval', 'rejected', 'FR-M2-3'],
  ['live', 'filled', 'FR-R6-2'],
  ['live', 'closed', 'FR-R2-6 FR-M2-5'],
  ['expired', 'filled', 'FR-R6-2'],
];

const TERMINAL = ['filled', 'closed'];

// Messages name states in words: "pending_approval" -> "pending approval".
const spoken = (value) => String(value).replace(/_/g, ' ');

function allowedTag(from, to) {
  const row = ALLOWED.find(([f, t]) => f === from && t === to);
  return row ? row[2] : null;
}

function forbiddenReason(from, to) {
  if (from === to) return 'same-to-same';
  if (to === 'expired') return 'expired is derived, never a target (ARCH-15)';
  if (TERMINAL.includes(from)) return `${from} is terminal`;
  return 'not in the PRD §3 map';
}

function expectInvalidTransition(fn, ...words) {
  let caught;
  try {
    fn();
  } catch (err) {
    caught = err;
  }
  expect(caught).toBeInstanceOf(InvalidTransitionError);
  expect(caught).toBeInstanceOf(RuleViolationError);
  expect(caught.name).toBe('InvalidTransitionError');
  expect(caught.code).toBe('invalid_transition');
  for (const word of words) expect(caught.message).toContain(word);
}

describe('POSTING_TRANSITIONS map (ARCH-12)', () => {
  test('NFR-4 is keyed over exactly POSTING_STATUS_EFFECTIVE and every value is a frozen array of stored statuses', () => {
    expect(Object.isFrozen(POSTING_TRANSITIONS)).toBe(true);
    expect([...Object.keys(POSTING_TRANSITIONS)].sort()).toEqual([...POSTING_STATUS_EFFECTIVE].sort());
    for (const targets of Object.values(POSTING_TRANSITIONS)) {
      expect(Object.isFrozen(targets)).toBe(true);
      for (const t of targets) expect(POSTING_STATUS).toContain(t);
    }
  });

  test('NFR-4 the map holds exactly the 7 PRD §3 edges', () => {
    const edges = Object.entries(POSTING_TRANSITIONS).flatMap(([f, ts]) => ts.map((t) => `${f}->${t}`)).sort();
    expect(edges).toEqual(ALLOWED.map(([f, t]) => `${f}->${t}`).sort());
    expect(edges).toHaveLength(7);
  });
});

describe('assertTransition(from, to): all 49 cells of the 7×7 effective-status matrix', () => {
  for (const from of POSTING_STATUS_EFFECTIVE) {
    for (const to of POSTING_STATUS_EFFECTIVE) {
      const tag = allowedTag(from, to);
      if (tag) {
        test(`NFR-4 ${tag} allows ${from} -> ${to}`, () => {
          expect(assertTransition(from, to)).toBeUndefined();
        });
      } else {
        test(`NFR-4 forbids ${from} -> ${to} (${forbiddenReason(from, to)}) with InvalidTransitionError naming both statuses in words`, () => {
          expectInvalidTransition(() => assertTransition(from, to), spoken(from), spoken(to));
        });
      }
    }
  }
});

describe('assertPostingAllows(effectiveStatus, toStage): all 56 cells of the 7×8 status × stage matrix (FR-R4-4)', () => {
  for (const status of POSTING_STATUS_EFFECTIVE) {
    for (const stage of APPLICATION_STAGE) {
      const blocked = TERMINAL.includes(status) && stage !== 'rejected';
      if (blocked) {
        test(`NFR-4 FR-R4-4 ${status} posting refuses stage change to ${stage} with InvalidTransitionError naming the status and the stage in words`, () => {
          expectInvalidTransition(() => assertPostingAllows(status, stage), spoken(status), spoken(stage));
        });
      } else {
        const why = TERMINAL.includes(status)
          ? 'rejection is the one allowed change'
          : status === 'expired'
            ? 'expired postings continue normally'
            : 'posting is not filled or closed';
        test(`NFR-4 FR-R4-4 ${status} posting allows stage change to ${stage} (${why})`, () => {
          expect(assertPostingAllows(status, stage)).toBeUndefined();
        });
      }
    }
  }
});

describe('exact message templates (from and to in the right order, states in words)', () => {
  test('NFR-4 assertTransition("live", "draft") reads "A live posting cannot become draft"', () => {
    expect(() => assertTransition('live', 'draft')).toThrow('A live posting cannot become draft');
  });

  test('NFR-4 assertTransition("expired", "closed") reads "An expired posting cannot become closed"', () => {
    expect(() => assertTransition('expired', 'closed')).toThrow('An expired posting cannot become closed');
  });

  test('NFR-4 assertTransition("pending_approval", "draft") names the status in words', () => {
    expect(() => assertTransition('pending_approval', 'draft')).toThrow('A pending approval posting cannot become draft');
  });

  test('NFR-4 FR-R4-4 assertPostingAllows("filled", "offer") reads the full refusal sentence', () => {
    expect(() => assertPostingAllows('filled', 'offer')).toThrow(
      'A filled posting does not allow an application to move to offer; only rejected is allowed',
    );
  });
});

describe('unknown values', () => {
  test('NFR-4 assertTransition rejects an unknown source status with InvalidTransitionError naming the value', () => {
    expectInvalidTransition(() => assertTransition('bogus', 'live'), 'bogus');
  });

  test('NFR-4 prototype keys ("constructor", "__proto__") are unknown values, not statuses', () => {
    expectInvalidTransition(() => assertTransition('constructor', 'live'), 'constructor');
    expectInvalidTransition(() => assertTransition('live', '__proto__'), '__proto__');
    expectInvalidTransition(() => assertPostingAllows('constructor', 'applied'), 'constructor');
  });

  test('NFR-4 assertTransition rejects an unknown target status with InvalidTransitionError naming the value', () => {
    expectInvalidTransition(() => assertTransition('live', 'bogus'), 'bogus');
    expectInvalidTransition(() => assertTransition('live', undefined), 'undefined');
  });

  test('NFR-4 assertPostingAllows rejects an unknown posting status or stage with InvalidTransitionError naming the value', () => {
    expectInvalidTransition(() => assertPostingAllows('bogus', 'applied'), 'bogus');
    expectInvalidTransition(() => assertPostingAllows('live', 'bogus'), 'bogus');
  });
});
