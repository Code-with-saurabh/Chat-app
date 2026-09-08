require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const { app } = require("./app");
const connectDB = require("./Utilities/DatabaseConnection");
const RefreshToken = require("./models/refreshTokenSchema.models.js");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

require("./Sockets")(io);

const cleanupExpiredTokens = async () => {
    try {
        const result = await RefreshToken.deleteMany({
            expiresAt: { $lt: new Date() }
        });
        if (result.deletedCount > 0) {
            console.log(`Cleaned up ${result.deletedCount} expired refresh tokens`);
        }
    } catch (error) {
        console.error("Token cleanup error:", error);
    }
};

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    cleanupExpiredTokens();
    setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
