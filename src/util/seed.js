const logger = require('./logger'),
    _ = require('lodash'),
    UserSchema = require('../user/userSchema'),
    RequestSchema = require('../request/requestSchema'),
    users = require('../user/mockdata'),
    requests = require('../request/mockdata');

// Logs message to the console
logger.log('Seeding the DB');

/**
 * Creates a MongoDB document
 *
 * @param {Model} modelType - MongoDB model
 * @param {row} object - Object to be appended to the DB. Must conform to Schema ruleset
 * @returns {Promise} - Promised returned with savedItem or an error
 */
const createDocument = (modelType, row) => {
  return new Promise((resolve, reject) => {
    new modelType(row).save((err, savedItem) => {
      return err ? reject(err) : resolve(savedItem);
    });
  });
};

/**
 * Resets / cleans Mongo DB data
 *
 */
const resetDB = () => {
  // Creates an array of models to reset
  const resetModels = [
    UserSchema, 
    RequestSchema, 
  ];

  // Maps through model array
  resetModels.map(model => {
    // Removes model from DB and exectures query
    return model.remove().exec();
  });

  // Returns a single promise when all promises are resolved
  return Promise.all(resetModels);
};

/**
 * Creates a user MongoDB row
 *
 * @param {Document} data - MongoDB document
 * @returns {Promise} - Promise
 */
const createUsers = data => {
  // Logging to console
  logger.log('Creating users');

  // Generates a collection of promises for each user row to be inserted
  let promises = users.map(user => {
    // Appends a new row for each user object
    return createDocument(UserSchema, user);
  });

  // When all promises in collection have been fulfilled
  return Promise.all(promises)
    // Updated MongoDB data for next caller
    .then((users) => {
      return _.merge({users: users}, data || {})
    });
};

/**
 * Creates a request MongoDB row
 *
 * @param {Document} data - MongoDB document
 * @returns {Promise} - Promise
 */
const createRequests = data => {
  // Logging to console
  logger.log('Creating requests');

  // Generates a collection of promises for each user row to be inserted
  let promises = requests.map(request => {
    // Appends a new row for each user object
    return createDocument(RequestSchema, request);
  });

  // When all promises in collection have been fulfilled
  return Promise.all(promises)
    // Return completion message for logging
    .then((requests) => {
      return _.merge({requests: requests}, data || {})
    });
};

/**
 * Initialises Mongo DB
 */
exports.initDB = () => {
  // Promise chain to populate DB
  resetDB()
    .then(createUsers)
    .then(createRequests)
    .then(logger.log.bind(logger))
    .catch(logger.log.bind(logger))
};