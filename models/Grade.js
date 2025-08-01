const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  period: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  comment: {
    type: String
  }
});

module.exports = mongoose.model('Grade', gradeSchema);
// models/Grade.js
// Este modelo define la estructura de las calificaciones en la base de datos MongoDB
