const bodyParser = require('body-parser');

/**
 * Sets an express application's general middleware
 *
 * @param {App} app - Express app object
 * @returns {App} - Express app object
 */
const setupMiddleware = app => {
  // Body parser setup
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // Allows cross origin requests with react app on 8080
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
  return app;
};

module.exports = setupMiddleware;