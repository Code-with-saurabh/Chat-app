const User = require("../models/userSchema.models");

const onlineUsers = new Map();

const userSocket = (io, socket) => {
    socket.on("join", async (userId) => {
        onlineUsers.set(userId, socket.id);
        socket.userId = userId;

        await User.findByIdAndUpdate(userId, {
            isOnline: true
        });

        socket.broadcast.emit("userOnline", { userId });
    });

    socket.on("typing", ({ senderId, receiverId }) => {
        const receiverSocketId = onlineUsers.get(receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", { senderId });
        }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
        const receiverSocketId = onlineUsers.get(receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userStopTyping", { senderId });
        }
    });

    socket.on("disconnect", async () => {
        if (socket.userId) {
            onlineUsers.delete(socket.userId);

            const lastSeen = new Date();
            await User.findByIdAndUpdate(socket.userId, {
                isOnline: false,
                lastSeen
            });

            socket.broadcast.emit("userOffline", { userId: socket.userId, lastSeen });
        }
    });
};

module.exports = userSocket;
module.exports.onlineUsers = onlineUsers;
