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

    socket.on("deleteMessage", async ({ messageId }) => {
        try {
            const senderId = socket.user._id;

            const message = await Message.findById(messageId);
            if (!message || message.sender.toString() !== senderId.toString()) {
                return;
            }

            message.isDeleted = true;
            message.text = "This message was deleted";
            await message.save();

            io.emit("messageDeleted", { messageId, conversationId: message.conversationId });

        } catch (error) {
            console.error("Delete message error:", error);
        }
    });

    socket.on("editMessage", async ({ messageId, text }) => {
        try {
            const senderId = socket.user._id;

            if (!text || !text.trim()) return;

            const message = await Message.findById(messageId);
            if (!message || message.sender.toString() !== senderId.toString()) {
                return;
            }

            message.text = text;
            message.isEdited = true;
            await message.save();

            io.emit("messageEdited", { messageId, text, conversationId: message.conversationId });

        } catch (error) {
            console.error("Edit message error:", error);
        }
    });
};
