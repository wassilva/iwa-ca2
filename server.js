const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const { DATABASE_URL, PORT } = process.env;
const server = express();

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

server.use(express.static("public"))
server.use(express.json());

server.get('/', (request, response) => {
  return response.send('Hello World');
});

server.listen(PORT, () => {
  console.log('Server Started!');
})