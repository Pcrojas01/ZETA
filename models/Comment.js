const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Comment', commentSchema);
// models/Comment.js
// Este modelo define la estructura de los comentarios en la base de datos MongoDB

