const Message = require("../models/messageSchema.models");
const Conversation = require("../models/conversationSchema.models");
const Notification = require("../models/notificationSchema.model");
const { onlineUsers } = require("./user.socket");

module.exports = (io, socket) => {
    socket.on("sendMessage", async ({
        conversationId,
        text,
        media,
        messageType
    }) => {
        try {
            const senderId = socket.user._id;

            const conversation = await Conversation.findById(conversationId);
            if (!conversation || !conversation.members.some(m => m.toString() === senderId.toString())) {
                return;
            }

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
