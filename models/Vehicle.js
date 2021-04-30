const { Schema, model } = require('mongoose');

// code responsible for mapping the record that comes from the requests
// and that shows the object structure that comes from the database

// creation of: type, manufacturer, model, vehicle year, value, quantity

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