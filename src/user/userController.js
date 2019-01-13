// User Model
const User = require('./userSchema');

/**
 * Middleware PARAMS method to add user to req on users/:id requests
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 * @param {id} string - Value of _id to query by
 */
exports.params = (req, res, next, id) => {
  // Finds user with _id matching param id
  User.findById(id)
    // exlcudes password property
    .select('-password')
    // executes query, returns promise
    .exec()
    // success promise callback
    .then(user => {
      // if bad idea was passed in
      if (!user) {
        // Passes error to next middleware
        next(new Error(`Did not find a user with id ${id}`))
      };
      // attatches user to request object
      req.user = user;
      // calls next middleware method
      next();
    },
    // error promise callback
    error => {
      // calls next middleware with error
      next(error);
    })
};

/**
 * Middleware GET method to handle getting all users
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.getAllUsers = (req, res, next) => {
  // find method to find all users
  User.find({})
    // exlcudes password property
    .select('-password')
    // executes query, returns promise
    .exec()
    // success promise callback
    .then(users => {
      // sends users
      res.json(users);
    },
    // error promise callback
    error => {
      // passes error to next method
      next(error);
    })
}

/**
 * Middleware GET method to handle getting ONE user
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.getOneUser = (req, res, next) => {
  // Response with req.user object from params
  res.json(req.user);
};

/**
 * Middleware POST method to handle adding a new user
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.addNewUser = (req, res, next) => {
  // Gets new user object
  const user = req.body;

  // Runs moongose create method on model => promise
  User.create(user)
  // Success promise method
  .then(user => {
    // Send newly created user object
    res.send(user);
  }, 
  // Error promise method
  error => {
    // Hand error to next error middleware
    next(error);
  })
};