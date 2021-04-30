const express = require('express');
require('dotenv').config();
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

//environment variable
const { DATABASE_URL, PORT } = process.env;
const server = express();

// Here is when the server went to Heroku, automatically heroku knows by the settings
// that the DB URL is that gigantic stretch that connects the DB
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

server.use('/', express.static("public"))
server.use(express.json());

server.set('views', __dirname + '/views');
server.engine('html', require('ejs').renderFile);

server.set('view engine', 'ejs');

//-------

server.get('/', function(request, response) {
  response.render('vehicles.html');
});

//viewing route of all vehicles.

server.get('/vehicle', async (request, response) => {
  const vehicles = await Vehicle.find({});
  return response.json({'vehicles': vehicles});
});

// validations (check)
// one vehicle viewing route, specific vehicle
server.get('/vehicle/:id', [
  check('id', 'ID format is incorrect')
    .exists()
    .isLength({ min: 24, max: 24 })
    .isAlphanumeric()

], async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).json(errors.array());
  }

  const { id } = request.params;

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return response.status(400).json({ error: "Vehicle does not exists" });
  }

  return response.status(200).json({vehicle: vehicle});
});

// vehicle creation route
server.post('/vehicle', [
  check('type') // validation by type
    .exists().withMessage('The type must be exists')
    .isString().withMessage('The type must be a string')
    .isAlpha().withMessage('The type must be character'),
  check('manufacturer') // validation by manufacturer
    .exists().withMessage('The manufacturer must be exists')
    .isString().withMessage('The manufacturer must be a string'),
  check('model') // validation by model
    .exists().withMessage('The model must be exists')
    .isString().withMessage('The model must be a string'),
  check('vehicle_year') // validation by vehicle year
    .exists().withMessage('The vehicle_year must be exists')
    .isNumeric().withMessage('The vehicle_year must be a number'),
  check('value') // validation by value
    .exists().withMessage('The value must be exists')
    .isNumeric().withMessage('The value must be a number'),
  check('quantity') // validation by quantidade
    .exists().withMessage('The quantity must be exists')
    .isNumeric().withMessage('The quantity must be a number')
], async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).json(errors.array());
  }

  // will take all the information that comes from the request for the object to be created and write it to the DB
  const { type, manufacturer, model, vehicle_year, value, quantity } = request.body;

 // validation where requests will be informed and so to store in the database.
 // create method connect with DB
  const vehicle = await Vehicle.create({
    type,
    manufacturer,
    model,
    vehicle_year,
    value,
    quantity
  });

  return response.status(201).json({vehicle: vehicle});
});

// single vehicle update route.
server.put('/vehicle/:id', [
  check('id', 'ID format is incorrect')
    .exists()
    .isLength({ min: 24, max: 24 })
    .isAlphanumeric(),
  check('type')
    .exists().withMessage('The vehicle_year must be exists')
    .isString().withMessage('The type must be a string')
    .isAlpha().withMessage('The type must be character'),
  check('manufacturer')
    .exists().withMessage('The manufacturer must be exists')
    .isString().withMessage('The manufacturer must be a string'),
  check('model')
    .exists().withMessage('The model must be exists')
    .isString().withMessage('The model must be a string'),
  check('vehicle_year')
    .exists().withMessage('The vehicle_year must be exists')
    .isNumeric().withMessage('The vehicle_year must be a number'),
  check('value')
    .exists().withMessage('The value must be exists')
    .isNumeric().withMessage('The value must be a number'),
  check('quantity')
    .exists().withMessage('The quantity must be exists')
    .isNumeric().withMessage('The quantity must be a number')
], async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).json(errors.array());
  }
  const { id } = request.params;
  const { type, manufacturer, model, vehicle_year, value, quantity } = request.body;

 // if found by the ID that was requested, the system is ok,
 // otherwise it will be mentioned that the vehicle does not exist.
  const vehicle = await Vehicle.findByIdAndUpdate({ _id: id }, { type, manufacturer, model, vehicle_year, value, quantity }, { new: true });

  if (!vehicle) {
    return response.status(400).json({ error: "Vehicle does not exits " });
  }

  return response.status(200).json({vehicle: vehicle});
});

// route to delete a vehicle
server.delete('/vehicle/:id', [
  check('id', 'ID format is incorrect')
    .exists()
    .isLength({ min: 24, max: 24 })
    .isAlphanumeric()
], async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    return response.status(422).json(errors.array());
  }

  const { id } = request.params;

  // checks if the vehicle exists, if it exists, it will be deleted.
  const vehicle = await Vehicle.findByIdAndDelete({ _id: id });

  if (!vehicle) {
    return response.status(400).json({ success: false, message: "Vehicle does not exists!" });
  }

  return response.status(200).json({ success: true, message: "Vehicle successfully deleted!" });
});


server.listen(PORT, () => {
  console.log('Server Started!');
})