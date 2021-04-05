const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

const { DATABASE_URL, PORT } = process.env;
const server = express();

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

server.use(express.static("public"))
server.use(express.json());

server.get('/vehicle', async (request, response) => {
  const vehicles = await Vehicle.find({});
  return response.json(vehicles);
});

server.get('/vehicle/:id', async(request, response) => {
  const { id } = request.params; 

  const vehicle = await Vehicle.findById(id);

  if(!vehicle) {
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

server.listen(PORT, () => {
  console.log('Server Started!');
})