const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

const User = require('./models/User'); // Assuming you have a User model
const Chat = require('./models/Chat'); // Assuming you have a User model
const http = require('http');
const socketIo = require('socket.io');

const app = express();

const ChatServer = http.createServer(app);
// const io = socketIo(ChatServer);
const io = socketIo(ChatServer, {
  cors: {
    origin: "http://localhost:3000",  
    methods: ["GET", "POST"], 
  },
});
// Middleware
app.use(cors());
app.use(express.json());  
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



const MongoURL= process.env.MONGO_URI;

mongoose.connect(MongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('\n\nConnected to MongoDB\n\n');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to MongoDB: ' + err);
});


io.on('connection', (socket) => {
  console.log('A user connected');
 
  
   

  socket.on('sendMessage', (data) => {
    console.log('Received message:', data);
  });


  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});



const port = process.env.PORT || 5000;
const server = ChatServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
 

 
module.exports = app;
