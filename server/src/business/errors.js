'use strict';

// Business error vocabulary (SHAPES.md S9). Each class carries `name`, the S9
// `code`, and optional `details`. The business layer never sets an HTTP status;
// presentation/errors.js owns the one code-to-status mapping.

class BusinessError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    if (details !== undefined) this.details = details;
  }
}

class ValidationError extends BusinessError {
  constructor(message = 'Validation failed', details) {
    super('validation_failed', message, details);
  }
}

class UnauthenticatedError extends BusinessError {
  constructor(message = 'Authentication required', details) {
    super('unauthenticated', message, details);
  }
}

class AccountSuspendedError extends BusinessError {
  constructor(message = 'This account is suspended', details) {
    super('account_suspended', message, details);
  }
}

class ForbiddenError extends BusinessError {
  constructor(message = 'Not allowed', details) {
    super('forbidden', message, details);
  }
}

class NotFoundError extends BusinessError {
  constructor(message = 'Not found', details) {
    super('not_found', message, details);
  }
}

class RuleViolationError extends BusinessError {
  constructor(message = 'This change is not allowed', details) {
    super('rule_violation', message, details);
  }
}

class InvalidTransitionError extends RuleViolationError {
  constructor(message = 'This state change is not allowed', details) {
    super(message, details);
    this.code = 'invalid_transition';
  }
}

class ConcurrentChangeError extends RuleViolationError {
  constructor(message = 'The record changed since it was read; reload and try again', details) {
    super(message, details);
    this.code = 'concurrent_change';
  }
}

class DuplicateApplicationError extends RuleViolationError {
  constructor(message = 'An open application to this posting already exists', details) {
    super(message, details);
    this.code = 'duplicate_application';
  }
}

class OfferAlreadyOpenError extends RuleViolationError {
  constructor(message = 'Another application to this posting already has an open offer', details) {
    super(message, details);
    this.code = 'offer_already_open';
  }
}

class ApplicationCapReachedError extends RuleViolationError {
  // details: { count, cap }
  constructor(message = 'The application cap has been reached', details) {
    super(message, details);
    this.code = 'application_cap_reached';
  }
}

class ProfileIncompleteError extends RuleViolationError {
  // details: { missing: [] }
  constructor(message = 'The profile is incomplete', details) {
    super(message, details);
    this.code = 'profile_incomplete';
  }
}

module.exports = {
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
};
