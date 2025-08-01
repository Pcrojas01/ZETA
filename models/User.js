const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['ADMIN', 'DOCENTE', 'ESTUDIANTE'],
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
// models/users.js
// Este modelo define la estructura de los usuarios en la base de datos MongoDB
