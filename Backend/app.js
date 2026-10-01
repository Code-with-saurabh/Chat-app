const express = require('express');
const cors = require('cors');

const config = require("./config/env");

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  ...config.frontendUrl
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
];

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

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const refreshTokenRoutes = require("./routes/refreshToken.routes");
app.use("/api", refreshTokenRoutes);

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const messagesRouter = require('./routes/messages');
app.use('/api/messages', messagesRouter);

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.get("/api/health", (req, res) => {
  const mongoose = require("mongoose");
  res.status(200).json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = { app };
