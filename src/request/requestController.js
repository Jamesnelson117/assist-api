// Request Model
const Request = require('./requestSchema'),
  UserSchema = require('../user/userSchema')

/**
 * Middleware PARAMS method to add request to req on requests/:id requests
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 * @param {id} string - Value of _id to query by
 */
exports.params = (req, res, next, id) => {
  // Finds request with _id matching param id
  Request.findById(id)
  // Populates with author (excludes password)
  .populate({
    path: 'author',
    select: ['-password','-__v']
  })
  // Populates with assignee (excludes password)
  .populate({
    path: 'assignee',
    select: ['-password','-__v']
  })
  .populate({
    path: 'comments',
    select: ['-__v']
  })
  .populate({
    path: 'comments.author',
    select: ['-password','-__v']
  })
  // executes query, returns promise
  .exec()
  // Success promise callback
  .then(request => {
    // If bad ID data passed in
    if (!request) {
      // Pass error to catch middleware stack
      next(new Error(`Did not find request with id ${id}`));
    };
    // Attatches request object to req.request
    req.request = request;
    // Calls next middleware method
    next();
  },
  // Error promise callback
  error => {
    // Calls next middleware method
    next(new Error(`Did not find request with id ${id}`));
  })
};

/**
 * Middleware GET method to handle getting all requests
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.getAllRequests = (req, res, next) => {
  Request.find({})
    // Populates with author (excludes password)
    .populate({
      path: 'author',
      select: ['-password','-__v']
    })
    // Populates with assignee (excludes password)
    .populate({
      path: 'assignee',
      select: ['-password','-__v']
    })
    .populate({
      path: 'comments',
      select: ['-__v']
    })
    .populate({
      path: 'comments.author',
      select: ['-password','-__v']
    })
    // executes query, returns promise
    .exec()
    // Success promise callback
    .then(requests => {
      // Sends json rep of requests
      res.json(requests)
    },
    // Error promise callback
    error => {
      // Calls next middleware method
      next(error)
    });
};

/**
 * Middleware GET method to handle getting ONE request
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.getOneRequest = (req, res, next) => {
  // Sends json rep of the request
  res.json(req.request);
};

/**
 * Middleware PUT method to handle adding a request
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.postRequest = (req, res, next) => {
  // Get request object from req.body
  const request = req.body;
  // Running mongoose create method on Schema => promise
  Request.create(request)
  // promise success method
  .then(request => {
    // Server response with newly created request
    res.send(request);
  }, 
  // promise error method
  error => {
    // Pass error to next middleware method
    next(error);
  })
};

/**
 * Middleware PATCH method to handle editing a request
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.patchRequest = (req, res, next) => {
  const edits = req.body;
  const orginalRequestID = req.request._id;

  if (Object.keys(edits).length === 0) return res.status(400).send('Patch data not found');

  Request.findByIdAndUpdate(orginalRequestID, edits, { new: true })
  .exec()
  .then(request => {
    return res.status(200).send(request);
  }, 
  error => {
    next(error)
  });
};

/**
 * Middleware DELETE method to handle deleting a request
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.deleteRequest = (req, res, next) => {
  Request.findByIdAndDelete(req.request._id)
  .exec()
  .then(request => {
    return res.status(200).send(request._id);
  }),
  error => {
    next(error)
  };
};

/**
 * Middleware POST method to handle adding a request
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.postComment = (req, res, next) => {
  const requestID = req.request._id;
  const comment = req.body.comment;

  UserSchema.findById(comment.author)
    .exec()
    .then(() => {
      Request.findByIdAndUpdate(requestID, {
        $addToSet: {
          comments: comment
        }}, { new: true }
      )
      .exec()
      .then((updatedRequest) => {
        return res.status(200).send(updatedRequest);
      })
      .catch((error) => {
        next(error);
      })
    })
    .catch((error) => {
      next(error);
    })
};
