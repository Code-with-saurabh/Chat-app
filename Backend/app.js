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
app.use(cors());//jub 2 diff router pese req bhejna ho to server reject kar deta hai , isliye ham cros use karte hai
app.use(express.json());  //json
app.use(express.urlencoded({ extended: true }));//html

// Import routes
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const messagesRouter = require('./routes/messages');
app.use('/api/messages',messagesRouter);


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


const users  = {};

io.on('connection', (socket) => {
  console.log('A user connected : '+socket.id);
	
	socket.on("join",(data)=>{
		users[data.userId] = socket;
		console.log(`\nUser[${data.userId}] Added To Users : ${socket.id} \n`);
	});
 /*socket.on("SetMessage", (data)=>{
	 const {senderId,receiverId,message} = data;
	 
	 users[senderId] = socket;
	 
	 if (users[receiverId]) {
		  console.log(`Sending message to ${receiverId}`);
		    users[receiverId].emit('receiveMessage', data);
	 }else{
		 console.log(`User ${receiverId} is not connected.`);
	 }
	 // console.log(data);
 });
  */
  socket.on("SetMessage",async (data)=>{
	 const {senderId,receiverId,message} = data;
	 
	 // save to DB
	 try{
		 const newMessage = new Chat({
			 sender : senderId,
			 receiver:receiverId,
			 message
		 });
		const resutltData =  await newMessage.save();
		 // console.log("message Save",resutltData);
		 console.log("message Save");
	 }catch(err){
		 console.error("Error saving message : ",err);
	 }
	 
	 if(users[receiverId]){
		 users[receiverId].emit("receiveMessage",data);
	 }else{
		 console.log(`User ${receiverId} is not online`);
	 }
	 
	 console.log(data);
 });
 
   socket.on("typing",({senderId,receiverId})=>{
	   if(users[receiverId]){
		   users[receiverId].emit("showTyping",{senderId});
	   }
   });
  

  socket.on('disconnect', () => {
 
    console.log('A user disconnected : '+socket.id);
	 for (let userId in users) {
      if (users[userId] === socket) {
        delete users[userId]; 
        break;
      }
    }
  });
});

const port = process.env.PORT || 5000;
const server = ChatServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
 

 
module.exports = app;
