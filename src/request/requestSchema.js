let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let requestSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  message: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true
  },
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false,
    required: true
  }
});

module.exports = mongoose.model('Requests', requestSchema);