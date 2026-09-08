const jwt = require("jsonwebtoken");
const User = require("../models/userSchema.models");
const userSocket = require("./user.socket");
const messageSocket = require("./message.socket");

module.exports = (io) => {
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-Password");
            if (!user) {
                return next(new Error("User not found"));
            }
            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        userSocket(io, socket);
        messageSocket(io, socket);
    });
};
