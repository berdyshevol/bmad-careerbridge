// Mirrors client/src/config.js's exports with test values so Jest never has
// to parse import.meta syntax (client/jest.config.js moduleNameMapper).
module.exports = {
  API_BASE_URL: '',
  UNREAD_POLL_MS: 60000,
};
