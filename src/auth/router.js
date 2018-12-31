const express = require('express');
const authController = require('./controller');

// Creates an express router
const router = express.Router();

// api/auth/login route logic
router.route('/login')
  .post([authController.verifyUser, authController.signIn]);

module.exports = router;