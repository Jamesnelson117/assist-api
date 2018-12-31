const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Defines the schema of a user object
let userSchema = new Schema({
  firstName: String,
  surName: String,
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  scope: {
    type: String
  }
});

// Life cycle hooks for saving of a new user
userSchema.pre('save', function(next) {
  // Encypts password
  this.password = this.encyptPassword(this.password);
  return next();
});

// Methods defined on all users
userSchema.methods = {
  /**
   * Encypts a plain string password
   *
   * @param {string} plainTxtPassword - String version of password
   * @returns {string} - Hashed version of password
   */
  encyptPassword: function(plainTxtPassword) {
    // Generates a salt
    let salt = bcrypt.genSaltSync(10);

    // Returns a hashed version of password
    return bcrypt.hashSync(plainTxtPassword, salt);
  },
  /**
   * Checks if plain string passwords matches encypted version
   *
   * @param {string} hashedPassword - Hashed version of password
   * @returns {boolean} - Boolean on wether passwords match
   */
  auth: function(hashedPassword) {
    // Returns boolean on wether passwords match
    return bcrypt.compareSync(hashedPassword, this.password);
  },
};

module.exports = mongoose.model('User', userSchema);