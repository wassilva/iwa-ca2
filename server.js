const express = require('express');
require('dotenv').config();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

const { DATABASE_URL, PORT } = process.env;
const server = express();

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

server.use(express.static("public"))
server.use(express.json());

server.get('/vehicle', async (request, response) => {
  const vehicles = await Vehicle.find({});
  return response.json(vehicles);
});

server.get('/vehicle/:id', [
  check('id', 'ID format is incorrect')
    .exists()
    .isLength({min: 24, max: 24})
    .isAlphanumeric()

], async (request, response) => {
  const errors = validationResult(request);

  if(!errors.isEmpty()) {
    return response.status(422).json(errors.array());
  }

  const { id } = request.params;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return response.status(400).json({ error: "Vehicle does not exists" });
  }

  return response.status(200).json(vehicle);
});

server.post('/vehicle/store', async (request, response) => {
  const { type, manufacturer, model, vehicle_year, value, quantity } = request.body;

  const vehicle = await Vehicle.create({
    type,
    manufacturer,
    model,
    vehicle_year,
    value,
    quantity
  });

  return response.status(201).json(vehicle);
});

server.put('/vehicle/:id/update', async (request, response) => {
  const { id } = request.params;
  const { type, manufacturer, model, vehicle_year, value, quantity } = request.body;

  const vehicle = await Vehicle.findByIdAndUpdate({ _id: id }, { type, manufacturer, model, vehicle_year, value, quantity }, { new: true });

  if (!vehicle) {
    return response.status(400).json({ error: "Vehicle does not exits " });
  }

  return response.status(200).json(vehicle);
});

server.delete('/vehicle/:id/delete', async (request, response) => {
  const { id } = request.params;

  const vehicle = await Vehicle.findByIdAndDelete({ _id: id });

  if (!vehicle) {
    return response.status(400).json({ message: "Vehicle does not exists" });
  }

  return response.status(200).json({ message: "Vehicle deleted" });
});

server.listen(PORT, () => {
  console.log('Server Started!');
})