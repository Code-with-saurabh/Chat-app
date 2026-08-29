const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
