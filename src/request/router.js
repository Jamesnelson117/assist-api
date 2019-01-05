// Reference to express
const express = require('express');
// Reference to requestController
const requestController = require('./requestController');
const authController = require('../auth/controller');

// Creates a new router
const router = express.Router();

router.param('id', requestController.params);

router.route('/')
  .get(requestController.getAllRequests)
  .post(requestController.postRequest)

router.route('/:id')
  .get(requestController.getOneRequest)
  .patch([
    authController.hasUpdateAccess,
    requestController.patchRequest
  ])
  .delete([
    authController.hasUpdateAccess,
    requestController.deleteRequest
  ])

router.route('/:id/comment')
  .post(requestController.postComment);

// Exports router
module.exports = router;