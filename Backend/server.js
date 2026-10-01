const http = require("http");
const { Server } = require("socket.io");

const config = require("./config/env");
const { app } = require("./app");
const connectDB = require("./Utilities/DatabaseConnection");
const RefreshToken = require("./models/refreshTokenSchema.models.js");

const HOST = config.host;

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

const waitForDatabase = async (retries = 10, delayMs = 3000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await connectDB();
            return true;
        } catch (error) {
            console.error(`DB connect attempt ${attempt}/${retries} failed:`, error.message);
            if (attempt === retries) throw error;
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
    return false;
};

const keepAlive = () => {
    const interval = config.keepAliveIntervalMs;
    const ping = () => {
        const port = server.address() && server.address().port;
        if (!port) return;
        const req = http.get(
            { host: "127.0.0.1", port, path: "/api/health", timeout: 10000 },
            (res) => {
                res.resume();
                console.log(`Keep-alive ping → ${res.statusCode}`);
            }
        );
        req.on("error", () => {});
        req.on("timeout", () => req.destroy());
    };
    const timer = setInterval(ping, interval);
    timer.unref();
    return timer;
};

let keepAliveTimer = null;
let shuttingDown = false;

const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`${signal} received. Shutting down gracefully...`);

    if (keepAliveTimer) clearInterval(keepAliveTimer);

    io.close();
    server.close(() => {
        console.log("HTTP server closed.");
        const mongoose = require("mongoose");
        mongoose.connection
            .close()
            .then(() => {
                console.log("MongoDB connection closed.");
                process.exit(0);
            })
            .catch(() => process.exit(0));
    });

    setTimeout(() => process.exit(1), 10000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

waitForDatabase()
    .then(() => {
        server.listen(config.port, HOST, () => {
            const { port } = server.address();
            config.port = port;
            console.log(`Server running on http://${HOST}:${port}`);
            console.log(`Health check: http://127.0.0.1:${port}/api/health`);
        });

        keepAliveTimer = keepAlive();

        cleanupExpiredTokens();
        setInterval(cleanupExpiredTokens, 60 * 60 * 1000).unref();
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err);
        process.exit(1);
    });
