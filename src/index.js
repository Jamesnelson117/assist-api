// API Router dependencies
const express = require('express');
const userRouter = require('./user/router');
const requestRouter = require('./request/router');
const authRouter = require('./auth/router');

// Sets up api router
const api = express.Router();

// userRouter to handle /users requests
api.use('/users', userRouter);

// requestRouter to handle /requests requests
api.use('/requests', requestRouter);

api.use('/auth', authRouter);

// Exports api router
module.exports = api;