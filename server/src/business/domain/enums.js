'use strict';

// Stored enum values (SHAPES.md S1). These are the exact strings written to the
// database; the migrations' CHECK constraints list the same sets.

const POSTING_STATUS = Object.freeze([
  'draft',
  'pending_approval',
  'live',
  'filled',
  'closed',
  'rejected',
]);

// `expired` is derived on read (ARCH-15), never stored; it exists only as a
// source in the posting transition map.
const POSTING_STATUS_EFFECTIVE = Object.freeze([...POSTING_STATUS, 'expired']);

const APPLICATION_STAGE = Object.freeze([
  'applied',
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
  'withdrawn',
  'declined',
]);

const ACTIVE_STAGES = Object.freeze(['applied', 'screening', 'interview', 'offer']);

const ACCOUNT_STATUS = Object.freeze(['active', 'suspended']);

const ACCOUNT_ROLE = Object.freeze(['applicant', 'recruiter', 'administrator']);

// Shared by organization_members.status and organizations.status.
const MEMBERSHIP_STATUS = Object.freeze(['pending_approval', 'approved', 'rejected']);

const INTERVIEW_OUTCOME = Object.freeze(['passed', 'failed', 'no_show']);

const EMPLOYMENT_TYPE = Object.freeze(['full_time', 'part_time', 'internship', 'contract']);

module.exports = {
  POSTING_STATUS,
  POSTING_STATUS_EFFECTIVE,
  APPLICATION_STAGE,
  ACTIVE_STAGES,
  ACCOUNT_STATUS,
  ACCOUNT_ROLE,
  MEMBERSHIP_STATUS,
  INTERVIEW_OUTCOME,
  EMPLOYMENT_TYPE,
};
