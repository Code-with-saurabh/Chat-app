const User = require("../models/userSchema.models");

const onlineUsers = new Map();

const userSocket = (io, socket) => {
    const userId = socket.user._id.toString();
    socket.userId = userId;
    onlineUsers.set(userId, socket.id);

    User.findByIdAndUpdate(userId, { isOnline: true }).exec();
    socket.broadcast.emit("userOnline", { userId });

    socket.on("typing", ({ receiverId }) => {
        const receiverSocketId = onlineUsers.get(receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", { senderId: userId });
        }
    });

    socket.on("stopTyping", ({ receiverId }) => {
        const receiverSocketId = onlineUsers.get(receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userStopTyping", { senderId: userId });
        }
    });

    socket.on("disconnect", async () => {
        onlineUsers.delete(userId);

        const lastSeen = new Date();
        await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen
        });

        socket.broadcast.emit("userOffline", { userId, lastSeen });
    });
};

module.exports = userSocket;
module.exports.onlineUsers = onlineUsers;
