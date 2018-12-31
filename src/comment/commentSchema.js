const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Comment', commentSchema);