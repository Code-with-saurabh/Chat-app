const userSocket = require("./user.socket");
const messageSocket = require("./message.socket");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // Attach user related events
        userSocket(io, socket);

        // Attach message related events
        messageSocket(io, socket);
    });
};
