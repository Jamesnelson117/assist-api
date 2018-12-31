// Reference to the express app
const express = require('express');
// Reference to userController
const userController = require('./userController');

const authController = require('../auth/controller');

// Creates a new router
const userRouter = express.Router();

// Middleware for when param id is passed in
userRouter.param('id', userController.params);

// Routes for root - api/users
userRouter.route('/')
  .get([authController.verifyToken, userController.getAllUsers])
  .post([authController.verifyToken, authController.vertifyAdmin, userController.addNewUser])

userRouter.route('/:id')
  .get(userController.getOneUser)

// Exports router
module.exports = userRouter;