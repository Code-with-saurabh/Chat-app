require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const { app } = require("./app");
const connectDB = require("./Utilities/DatabaseConnection");

// 1️⃣ Create HTTP server from Express app
const server = http.createServer(app);

// 2️⃣ Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Change in production
        methods: ["GET", "POST"],
    },
});

// 3️⃣ Initialize Socket Logic
require("./Sockets")(io);

// 4️⃣ Connect Database first, then start server
connectDB().then(() => {
    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});

