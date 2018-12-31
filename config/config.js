// Default node env config object
let enviorments = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
};

// Sets Node Env type
process.env.NODE_ENV = process.env.NODE_ENV || enviorments.dev;
enviorments.type = process.env.NODE_ENV;

// Destructuring object with default params
let {
  logging = true,
  seed = true,
  db: {
    url = "mongodb://localhost/assistDB"
  },
  port = process.env.PORT || 3000,
  secret = process.env.SECRET || 'shhimasecret'

} = require(`./${enviorments.type}`);

// Restructuring return object
module.exports = {
  logging,
  seed,
  db: {
    url
  },
  port,
  secret
};