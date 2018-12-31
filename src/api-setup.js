const express = require('express'),
    setupMiddleware = require('./util/setupMiddleware'),
    logger = require('./util/logger'),
    mongoose = require('mongoose'),
    seed = require('./util/seed'),
    config = require('../config/config'),
    api = require('./index.js');

if (config.seed) {
  // Connects to the Mongo DB
  mongoose.connect(config.db.url);
  mongoose.connection.on('error',
   console.error.bind(console, 'Failed to connect to the database')
  );
  seed.initDB();
};

// Setup express app
const app = setupMiddleware(express());

// Setup API Router
app.use('/api', api);

// Debugger middleware
app.use((err, req, res, next) => {
  // Users the logger error function to console log 
  // error stack
  logger.error(err.stack);
  res.status(500).send('Error');
});

// Exports express application
module.exports = app;