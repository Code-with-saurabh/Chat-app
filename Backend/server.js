require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const { app } = require("./app");
const connectDB = require("./Utilities/DatabaseConnection");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

require("./Sockets")(io);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
