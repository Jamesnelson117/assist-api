const app = require('./src/api-setup'),
  config = require('./config/config'),
  logger = require('./src/util/logger');

app.listen(config.port, () => {
  logger.log(`Running on port ${config.port}`);
});
