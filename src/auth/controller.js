const User = require('../user/userSchema');
const JWT = require('jsonwebtoken');
const config = require('../../config/config');

/**
 * Returns a signed JSON Web Token
 *
 * @param {user} Object - User object
 * @returns {JWT} JSON web token - Signed JSON web token
 */
const signToken = user => {
  return JWT.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    id: user.id,
    scope: user.scope || 'default'
  },
  config.secret);
};

/**
 * Verify user is of admin access level
 *
 * @param {string} accessLevel - string represenation of scope
 * @returns {boolean} - Boolean defining wether admin or not
 */
const hasAdminAccess = accessLevel => isMatch(accessLevel, 'admin') ? true : false;

/**
 * Utility class to determine wether two arguments are a match
 *
 * @param {any} a - Comparision item one
 * @param {any} a - Comparision item two
 * @returns {boolean} - Boolean defining wether items are a match
 */
const isMatch = (a, b) =>  a == b ? true : false;

/**
 * Utility class for decoding a token
 *
 * @param {JWT} token - uncoded JWT
 * @returns {JWT} - decoded JWT
 */
const decodeToken = token => {
  token = token.split(' ')[1];
  return JWT.decode(token);
};

/**
 * Middleware method for signing in a user
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.signIn = (req, res, next) => {
  // Gets a signed JSON web token
  const token = signToken(req.user);

  // Responds with token
  res.status(200).send({
    token: token,
    user: req.user
  });
};

/**
 * Middleware method for ensuring a token exists
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.verifyToken = (req, res, next) => {
  // Gets token from authorization prop on req.headers
  let bearerToken = req.headers['authorization'];

  // Checks to see if token exists
  if (!bearerToken) {
    return res.status(403).send('Unauthorized');
  };

  // Format of token
  // bearer <token>
  bearerToken = bearerToken.split(' ')[1];

  if (!bearerToken) {
    return res.status(403).send('Failed to read token');
  };
  
  // JWT verify's token against secret
  JWT.verify(bearerToken, config.secret, (error, token) => {
    // If an error occurs
    if (error) {
      return res.status(403).send('Unauthorized');
    };

    // Next middleware method
    next();
  });
};

/**
 * Middleware method for validating JWT has admin access levels
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.vertifyAdmin = (req, res, next) => {
  // Gets token from authorization prop on req.headers
  let bearerToken = req.headers['authorization'];

  // Format of token
  // bearer <token>
  bearerToken = bearerToken.split(' ')[1];

  // Decodes token 
  const decodedToken = JWT.decode(bearerToken);

  // If user is admin continue to next middleware
  if (decodedToken.scope.toLowerCase() == 'admin') return next();

  // Return 403
  return res.status(403).send('Unauthorized');
};

/**
 * Verify user exists in DB with username and password
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.verifyUser = (req, res, next) => {
  // Gets reference to username and password on req.body
  const username = req.body.username,
  password = req.body.password;

  // If username or password was not signed in
  if (!username || !password) {
    // Response with 404
    return res.status(404).send('Provide a username and password');
  };

  // Runs a findOne mongoose query
  User.findOne({ username: username })
    // exectures query, returns promise
    .exec()
    // Success cb on promise
    .then(user => {
      // if user was not returned
      if (!user) {
        // response with 401
        return res.status(401).send('Failed to find user with that username');
      };

      // If passwords do not match
      if (!user.auth(password)) {
        // response with 401
        return res.status(401).send('Incorrect password provided');
      };

      // unsets password prop
      user.password = undefined;

      // attatch user to req.user
      req.user = user;

      // Call next middleware method
      next();
    },
    // Error cb on promise
    error => {

      // Call next error middleware
      next(error);
    });
};

/**
 * Determines wether currently auth user has update access rights
 *
 * @param {request} req - Express request object
 * @param {response} res - Express response object
 * @param {next} next - Express next object
 */
exports.hasUpdateAccess = (req, res, next) => {
  const token = decodeToken(req.headers['authorization']);
  if (!token) return res.status(400).send('Could not read token');
  if (hasAdminAccess(token.scope) || isMatch(token.id, req.request.author._id)) return next();
  return res.status(403).send('Unauthorised');
};