const Message = require("../models/messageSchema.models");
const Conversation = require("../models/conversationSchema.models");
const Notification = require("../models/notificationSchema.model");
const { onlineUsers } = require("./user.socket");

module.exports = (io, socket) => {
    socket.on("sendMessage", async ({
        conversationId,
        senderId,
        text,
        media,
        messageType
    }) => {
        try {
            const newMessage = await Message.create({
                conversationId,
                sender: senderId,
                text,
                media,
                messageType,
            });

            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: newMessage._id
            });

            const conversation = await Conversation.findById(conversationId);

            const receivers = conversation.members.filter(
                member => member.toString() !== senderId.toString()
            );

            receivers.forEach(receiverId => {
                const receiverSocketId = onlineUsers.get(receiverId.toString());

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receiveMessage", newMessage);
                }

                Notification.create({
                    recipient: receiverId,
                    sender: senderId,
                    type: "message"
                });
            });

        } catch (error) {
            console.error("Message error:", error);
        }
    });
};
