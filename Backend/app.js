const express = require('express');

const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

const User = require('./models/User'); // Assuming you have a User model
const Chat = require('./models/Chat'); // Assuming you have a User model

const app = express();



// Middleware
app.use(cors({
	origin: process.env.FRONTEND_URL || "http://localhost:5173",
	credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import routes
const refreshTokenRoutes = require("./routes/refreshToken.routes");
app.use("/api", refreshTokenRoutes);

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const messagesRouter = require('./routes/messages');
app.use('/api/messages', messagesRouter);



app.get("/", (req, res) => {
	res.send("Hello from the server!");
});


app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;

	return res.status(statusCode).json({
		success: false,
		message: err.message || "Internal Server Error",
		errors: err.errors || [],
	});
});



module.exports = { app };
