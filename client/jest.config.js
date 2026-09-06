'use strict';

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    // Explicit .js suffix required: a bare "./config" also matches
    // @testing-library/dom's own internal ./config module, which would
    // otherwise get silently redirected to this client-only mock too.
    '^(?:\\.{1,2}/)+config\\.js$': '<rootDir>/src/testMocks/config.js',
    '\\.(css|svg|png|jpg)$': '<rootDir>/src/testMocks/fileStub.js',
  },
  testMatch: ['**/*.test.{js,jsx}'],
};
