const userSocket = require("./user.socket");
const messageSocket = require("./message.socket");

module.exports = (io) => {
    io.on("connection", (socket) => {
        userSocket(io, socket);
        messageSocket(io, socket);
    });
};
