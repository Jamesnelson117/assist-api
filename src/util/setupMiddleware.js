const bodyParser = require('body-parser');

/**
 * Sets an express application's general middleware
 *
 * @param {App} app - Express app object
 * @returns {App} - Express app object
 */
const setupMiddleware = app => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  return app;
};

module.exports = setupMiddleware;