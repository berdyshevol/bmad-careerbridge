'use strict';

const { APPLICATION_STAGE, ACTIVE_STAGES } = require('./enums');
const { InvalidTransitionError, RuleViolationError } = require('../errors');
const { APPLICATION_TRANSITIONS, assertTransition } = require('./applicationStage');

// The PRD §3 application map as a literal table: [from, to, FR IDs]. Every
// cell of the 8×8 stage matrix gets one test below; a cell not in this table
// must throw. This file is the NFR-4 evidence for Application transitions.
const ALLOWED = [
  ['applied', 'screening', 'FR-R4-1'],
  ['screening', 'interview', 'FR-R4-1'],
  ['interview', 'offer', 'FR-R6-1'],
  ['applied', 'rejected', 'FR-R4-2'],
  ['screening', 'rejected', 'FR-R4-2'],
  ['interview', 'rejected', 'FR-R4-2'],
  ['applied', 'withdrawn', 'FR-A4-3'],
  ['screening', 'withdrawn', 'FR-A4-3'],
  ['interview', 'withdrawn', 'FR-A4-3'],
  ['offer', 'hired', 'FR-A5-4'],
  ['offer', 'declined', 'FR-A5-5'],
];

const PIPELINE = ['applied', 'screening', 'interview', 'offer'];
const TERMINAL = APPLICATION_STAGE.filter((s) => !ACTIVE_STAGES.includes(s));

// Messages name stages in words (underscores become spaces).
const spoken = (value) => String(value).replace(/_/g, ' ');

function allowedTag(from, to) {
  const row = ALLOWED.find(([f, t]) => f === from && t === to);
  return row ? row[2] : null;
}

// FR tag and reason for each forbidden cell.
function forbidden(from, to) {
  if (to === 'withdrawn') {
    return ['FR-A4-4', from === 'offer' ? 'no withdrawal from offer' : `no withdrawal from terminal ${from}`];
  }
  if (TERMINAL.includes(from)) return ['FR-R4-3', `${from} is terminal`];
  if (from === to) return ['FR-R4-3', 'same-to-same'];
  const fi = PIPELINE.indexOf(from);
  const ti = PIPELINE.indexOf(to);
  if (ti !== -1 && ti < fi) return ['FR-R4-3', 'backward move'];
  if (ti !== -1 && ti > fi + 1) return ['FR-R4-3', 'skipped stage'];
  if (to === 'hired' && from !== 'offer') return ['FR-R4-3', 'skipped stage (hired only from offer)'];
  if (to === 'declined' && from !== 'offer') return ['FR-R4-3', 'declined only from offer'];
  if (from === 'offer' && to === 'rejected') {
    return ['FR-R4-3', 'rejection is not allowed from offer; the FR-R6-3 fill cascade never needs it because S3 allows one open offer per posting'];
  }
  return ['NFR-4', 'not in the PRD §3 map'];
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

describe('APPLICATION_TRANSITIONS map (ARCH-12)', () => {
  test('NFR-4 is keyed over exactly APPLICATION_STAGE and every value is a frozen array of stages', () => {
    expect(Object.isFrozen(APPLICATION_TRANSITIONS)).toBe(true);
    expect([...Object.keys(APPLICATION_TRANSITIONS)].sort()).toEqual([...APPLICATION_STAGE].sort());
    for (const targets of Object.values(APPLICATION_TRANSITIONS)) {
      expect(Object.isFrozen(targets)).toBe(true);
      for (const t of targets) expect(APPLICATION_STAGE).toContain(t);
    }
  });

  test('NFR-4 the map holds exactly the 11 PRD §3 edges and terminal stages have none', () => {
    const edges = Object.entries(APPLICATION_TRANSITIONS).flatMap(([f, ts]) => ts.map((t) => `${f}->${t}`)).sort();
    expect(edges).toEqual(ALLOWED.map(([f, t]) => `${f}->${t}`).sort());
    expect(edges).toHaveLength(11);
    for (const s of TERMINAL) expect(APPLICATION_TRANSITIONS[s]).toEqual([]);
  });
});

describe('assertTransition(from, to): all 64 cells of the 8×8 stage matrix', () => {
  for (const from of APPLICATION_STAGE) {
    for (const to of APPLICATION_STAGE) {
      const tag = allowedTag(from, to);
      if (tag) {
        test(`NFR-4 ${tag} allows ${from} -> ${to}`, () => {
          expect(assertTransition(from, to)).toBeUndefined();
        });
      } else {
        const [fr, why] = forbidden(from, to);
        test(`NFR-4 ${fr} forbids ${from} -> ${to} (${why}) with InvalidTransitionError naming both stages in words`, () => {
          expectInvalidTransition(() => assertTransition(from, to), spoken(from), spoken(to));
        });
      }
    }
  }
});

describe('exact message template (from and to in the right order, stages in words)', () => {
  test('NFR-4 FR-R4-3 assertTransition("interview", "screening") reads "An application in stage interview cannot move to screening"', () => {
    expect(() => assertTransition('interview', 'screening')).toThrow(
      'An application in stage interview cannot move to screening',
    );
  });
});

describe('unknown values', () => {
  test('NFR-4 assertTransition rejects an unknown source stage with InvalidTransitionError naming the value', () => {
    expectInvalidTransition(() => assertTransition('bogus', 'screening'), 'bogus');
  });

  test('NFR-4 prototype keys ("constructor", "__proto__") are unknown values, not stages', () => {
    expectInvalidTransition(() => assertTransition('constructor', 'screening'), 'constructor');
    expectInvalidTransition(() => assertTransition('applied', '__proto__'), '__proto__');
  });

  test('NFR-4 assertTransition rejects an unknown target stage with InvalidTransitionError naming the value', () => {
    expectInvalidTransition(() => assertTransition('applied', 'bogus'), 'bogus');
    expectInvalidTransition(() => assertTransition('applied', undefined), 'undefined');
  });
});
