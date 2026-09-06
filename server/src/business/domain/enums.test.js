'use strict';

const enums = require('./enums');

// Exact S1 vocabulary (SHAPES.md). Membership is asserted order-insensitively;
// a module that stores a different string is non-compliant.
const EXPECTED = {
  POSTING_STATUS: ['draft', 'pending_approval', 'live', 'filled', 'closed', 'rejected'],
  POSTING_STATUS_EFFECTIVE: ['draft', 'pending_approval', 'live', 'filled', 'closed', 'rejected', 'expired'],
  APPLICATION_STAGE: ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected', 'withdrawn', 'declined'],
  ACTIVE_STAGES: ['applied', 'screening', 'interview', 'offer'],
  ACCOUNT_STATUS: ['active', 'suspended'],
  ACCOUNT_ROLE: ['applicant', 'recruiter', 'administrator'],
  MEMBERSHIP_STATUS: ['pending_approval', 'approved', 'rejected'],
  INTERVIEW_OUTCOME: ['passed', 'failed', 'no_show'],
  EMPLOYMENT_TYPE: ['full_time', 'part_time', 'internship', 'contract'],
};

const sorted = (xs) => [...xs].sort();

describe('S1 stored enums (enums.js)', () => {
  test('exports exactly the S1 enum names and nothing else', () => {
    expect(sorted(Object.keys(enums))).toEqual(sorted(Object.keys(EXPECTED)));
  });

  describe.each(Object.entries(EXPECTED))('%s', (name, values) => {
    test(`S1 ${name} has exactly the stored strings ${JSON.stringify(values)} (order-insensitive)`, () => {
      expect(Array.isArray(enums[name])).toBe(true);
      expect(sorted(enums[name])).toEqual(sorted(values));
      expect(new Set(enums[name]).size).toBe(values.length);
    });

    test(`S1 ${name} is frozen`, () => {
      expect(Object.isFrozen(enums[name])).toBe(true);
      expect(() => enums[name].push('bogus')).toThrow(TypeError);
      expect(enums[name]).toHaveLength(values.length);
    });
  });

  test('S1 ACTIVE_STAGES is a proper subset of APPLICATION_STAGE', () => {
    for (const stage of enums.ACTIVE_STAGES) {
      expect(enums.APPLICATION_STAGE).toContain(stage);
    }
    expect(enums.ACTIVE_STAGES.length).toBeLessThan(enums.APPLICATION_STAGE.length);
  });

  test('S1 ARCH-15 POSTING_STATUS_EFFECTIVE is the stored set plus "expired", and "expired" is never stored', () => {
    expect(sorted(enums.POSTING_STATUS_EFFECTIVE)).toEqual(sorted([...enums.POSTING_STATUS, 'expired']));
    expect(enums.POSTING_STATUS).not.toContain('expired');
  });
});
