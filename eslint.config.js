'use strict';

const js = require('@eslint/js');
const globals = require('globals');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const prettier = require('eslint-config-prettier');

// CommonJS tooling files (root config, scripts, server source, client's
// Jest/Babel config and test-only helpers) run under Node with require().
const nodeCommonJsFiles = [
  'eslint.config.js',
  'scripts/**/*.js',
  'server/**/*.js',
  'client/babel.config.js',
  'client/jest.config.js',
  'client/src/setupTests.js',
  'client/src/testMocks/**/*.js',
];

// vite.config.js runs under Node but is loaded as an ES module (import/export).
const nodeEsmFiles = ['client/vite.config.js'];

module.exports = [
  {
    ignores: [
      '**/node_modules/',
      'client/dist/',
      'coverage/',
      '_bmad/**',
      '_bmad-output/**',
      'inputs/**',
      'transcripts/**',
      '.claude/**',
      // Story 1.2's frozen business layer: never edit, so a future stricter
      // ruleset can never force a touch here either.
      'server/src/business/errors.js',
      'server/src/business/errors.test.js',
      'server/src/business/domain/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      // S8 use-case modules take a fixed (actor, input) signature even when
      // a given use case does not need one of them yet.
      'no-unused-vars': ['error', { args: 'none' }],
    },
  },
  {
    files: nodeCommonJsFiles,
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
  },
  {
    files: nodeEsmFiles,
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
  },
  {
    files: ['client/src/**/*.{js,jsx}'],
    ignores: ['client/src/setupTests.js', 'client/src/testMocks/**/*.js'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: globals.browser,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  prettier,
];
