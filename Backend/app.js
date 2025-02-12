const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

const User = require('./models/User'); // Assuming you have a User model
const http = require('http');
const socketIo = require('socket.io');

const app = express();

const ChatServer = http.createServer(app);
const io = socketIo(ChatServer);

// Middleware
app.use(cors());
app.use(express.json()); // Built-in JSON parser in Express
app.use(express.urlencoded({ extended: true }));

// Import routes
const usersRouter = require('./routes/users');

app.use('/api/users', usersRouter);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: 'Something went wrong!' });
});

app.get("/", (req, res) => {
    res.send("Hello from the server!");
});

// const MongoURL='mongodb+srv://gpgazhmrj:NiIAmKaqmT6CxKrz@cluster0.rdhlq.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0';
const MongoURL= process.env.MONGO_URI;

mongoose.connect(MongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('\n\nConnected to MongoDB\n\n');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB: ' + err);
});
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
 
 
module.exports = app;
