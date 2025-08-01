const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Period', periodSchema);
// models/Period.js
// Este modelo define la estructura de los periodos académicos en la base de datos MongoDB