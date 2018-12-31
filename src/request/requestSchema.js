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
  comments: [
    {
      type : mongoose.Schema.Types.ObjectId, 
      ref: 'Comment',
      required: false
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  }
});

module.exports = mongoose.model('Requests', requestSchema);