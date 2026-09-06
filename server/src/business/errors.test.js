'use strict';

const errors = require('./errors');

const {
  BusinessError,
  ValidationError,
  UnauthenticatedError,
  AccountSuspendedError,
  ForbiddenError,
  NotFoundError,
  RuleViolationError,
  InvalidTransitionError,
  ConcurrentChangeError,
  DuplicateApplicationError,
  OfferAlreadyOpenError,
  ApplicationCapReachedError,
  ProfileIncompleteError,
} = errors;

// [Class, S9 code, expected parent class]
const TABLE = [
  [ValidationError, 'validation_failed', BusinessError],
  [UnauthenticatedError, 'unauthenticated', BusinessError],
  [AccountSuspendedError, 'account_suspended', BusinessError],
  [ForbiddenError, 'forbidden', BusinessError],
  [NotFoundError, 'not_found', BusinessError],
  [RuleViolationError, 'rule_violation', BusinessError],
  [InvalidTransitionError, 'invalid_transition', RuleViolationError],
  [ConcurrentChangeError, 'concurrent_change', RuleViolationError],
  [DuplicateApplicationError, 'duplicate_application', RuleViolationError],
  [OfferAlreadyOpenError, 'offer_already_open', RuleViolationError],
  [ApplicationCapReachedError, 'application_cap_reached', RuleViolationError],
  [ProfileIncompleteError, 'profile_incomplete', RuleViolationError],
];

// S9 envelope codes minus `internal` (which presentation/errors.js owns).
const S9_CODES = [
  'validation_failed',
  'unauthenticated',
  'account_suspended',
  'forbidden',
  'not_found',
  'invalid_transition',
  'concurrent_change',
  'duplicate_application',
  'offer_already_open',
  'application_cap_reached',
  'profile_incomplete',
  'rule_violation',
];

describe('S9 business error classes (errors.js)', () => {
  describe.each(TABLE)('%p', (Cls, code, Parent) => {
    test(`S9 ${Cls.name} extends Error, BusinessError and ${Parent.name}`, () => {
      const err = new Cls('m');
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(BusinessError);
      expect(err).toBeInstanceOf(Parent);
      if (Parent === RuleViolationError) expect(err).toBeInstanceOf(RuleViolationError);
    });

    test(`S9 ${Cls.name} sets name "${Cls.name}" and code "${code}"`, () => {
      const err = new Cls('m');
      expect(err.name).toBe(Cls.name);
      expect(err.code).toBe(code);
      expect(err.message).toBe('m');
    });

    test(`S9 ${Cls.name} has a non-empty default message when the message is omitted`, () => {
      const err = new Cls();
      expect(typeof err.message).toBe('string');
      expect(err.message.length).toBeGreaterThan(0);
      expect(err.code).toBe(code);
    });

    test(`S9 ${Cls.name} passes details through when given and has no own details property when omitted`, () => {
      const details = { some: 'payload' };
      expect(new Cls('m', details).details).toBe(details);
      const bare = new Cls('m');
      expect(Object.prototype.hasOwnProperty.call(bare, 'details')).toBe(false);
      expect('details' in bare).toBe(false);
    });

    test(`S9 ${Cls.name} never carries an HTTP status`, () => {
      const err = new Cls('m');
      expect(err.status).toBeUndefined();
      expect(err.statusCode).toBeUndefined();
    });
  });

  test('S9 the codes across all classes are exactly the S9 envelope codes minus "internal"', () => {
    const codes = TABLE.map(([Cls]) => new Cls('m').code).sort();
    expect(codes).toEqual([...S9_CODES].sort());
    expect(new Set(codes).size).toBe(codes.length);
  });

  test('S9 the module exports exactly BusinessError plus the twelve S9 classes', () => {
    expect(Object.keys(errors).sort()).toEqual(['BusinessError', ...TABLE.map(([Cls]) => Cls.name)].sort());
  });
});
