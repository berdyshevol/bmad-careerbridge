'use strict';

// Require config first so a missing required variable fails fast, before
// anything else (including the persistence layer) is touched.
const config = require('./config');
const app = require('./presentation/app');

app.listen(config.port, () => {
  config.logger.info({ port: config.port }, 'careerbridge server listening');
});
