const express = require('express');
const mongoose = require('mongoose');

const { DB, PORT } = process.env;

const server = express();

const port = PORT;

mongoose.connect(DB);

server.use(express.static("public"))

server.use(express.json());

server.get('/', (request, response) => {
  return response.send('Hello World');
});

server.listen(port, () => {
  console.log('Server Started!');
})