const { Schema, model } = require('mongoose');

const VehicleSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  vehicle_year: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
}, {
  timestamps: true,
});

module.exports = model('Vehicle', VehicleSchema);