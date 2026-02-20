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

            console.log("\n\n\n............Received message:", {
                conversationId,
                senderId,
                text,
                media,
                messageType
            });
            // 1️⃣ Save Message
            const newMessage = await Message.create({
                conversationId,
                sender: senderId,
                text,
                media,
                messageType,
            });

            const populatedMessage = await Message.findById(newMessage._id)
                .populate("sender", "Username profileImage");
            // 2️⃣ Update conversation lastMessage
            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: newMessage._id
            });

            // 3️⃣ Get conversation members
            const conversation = await Conversation.findById(conversationId);

            const receivers = conversation.members.filter(
                member => member.toString() !== senderId.toString()
            );

            // 4️⃣ Emit to all receivers
            receivers.forEach(receiverId => {
                const receiverSocketId = onlineUsers.get(receiverId.toString());

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receiveMessage", populatedMessage);
                }

                // Notification
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
