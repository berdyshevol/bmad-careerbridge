'use strict';

describe('config', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test('throws MissingConfigError naming both variables when unset', () => {
    delete process.env.DATABASE_URL;
    delete process.env.SESSION_SECRET;

    expect(() => require('./config')).toThrow(
      'Missing required environment variables: DATABASE_URL, SESSION_SECRET'
    );
  });

  test('loads cleanly when both required variables are present', () => {
    process.env.DATABASE_URL =
      'postgres://careerbridge:careerbridge@localhost:5432/careerbridge_test';
    process.env.SESSION_SECRET = 'test-secret';

    const config = require('./config');
    expect(config.databaseUrl).toBe(process.env.DATABASE_URL);
    expect(config.sessionSecret).toBe('test-secret');
  });
});
