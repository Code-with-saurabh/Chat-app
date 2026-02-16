const User = require("../models/userSchema.models");

const onlineUsers = new Map();

module.exports = (io, socket) => {

    socket.on("join", async (userId) => {

        onlineUsers.set(userId, socket.id);
        socket.userId = userId;

        await User.findByIdAndUpdate(userId, {
            isOnline: true
        });

        console.log("User online:", userId);
    });

    socket.on("disconnect", async () => {

        if (socket.userId) {

            onlineUsers.delete(socket.userId);

            await User.findByIdAndUpdate(socket.userId, {
                isOnline: false,
                lastSeen: new Date()
            });

            console.log("User offline:", socket.userId);
        }
    });
};

module.exports.onlineUsers = onlineUsers;
