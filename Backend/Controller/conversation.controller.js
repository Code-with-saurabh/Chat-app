const Conversation = require("../models/conversationSchema.models.js");
const ApiResponse = require("../Utilities/ApiResponse");
const asyncHandler = require("../Utilities/AsyncHandler");
const ApiError = require("../Utilities/ApiError.js");
const Message = require("../models/messageSchema.models.js");
const Notification = require("../models/notificationSchema.model.js");

const createOrGetConversation = asyncHandler(async (req, res) => {
    const senderId = req.user._id;
    const { receiverId } = req.body;

    if (!receiverId) {
        throw new ApiError(400, "receiverId required");
    }

    let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
        isGroup: false,
    });

    if (conversation) {
        return res.status(200).json(
            new ApiResponse(200, conversation, "Conversation exists")
        );
    }

    conversation = await Conversation.create({
        members: [senderId, receiverId],
    });

    return res.status(201).json(
        new ApiResponse(201, conversation, "Conversation created")
    );
});

const getMessagesByConversation = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    if (!conversationId) {
        throw new ApiError(400, "ConversationId required");
    }

    const messages = await Message.find({
        conversationId: conversationId,
    }).sort({ createdAt: 1 });

    return res.status(200).json(
        new ApiResponse(200, messages, "Messages fetched successfully")
    );
});

const searchMessages = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;
    const { q } = req.query;

    if (!conversationId || !q) {
        throw new ApiError(400, "conversationId and query are required");
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const messages = await Message.find({
        conversationId,
        text: { $regex: escaped, $options: "i" },
        isDeleted: false,
    }).sort({ createdAt: 1 });

    return res.status(200).json(
        new ApiResponse(200, messages, "Messages found")
    );
});

const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, "Message not found");
    }

    if (message.sender.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own messages");
    }

    message.isDeleted = true;
    message.text = "This message was deleted";
    await message.save();

    return res.status(200).json(
        new ApiResponse(200, message, "Message deleted")
    );
});

const editMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text || !text.trim()) {
        throw new ApiError(400, "Text is required");
    }

    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, "Message not found");
    }

    if (message.sender.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only edit your own messages");
    }

    message.text = text;
    message.isEdited = true;
    await message.save();

    return res.status(200).json(
        new ApiResponse(200, message, "Message edited")
    );
});

const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const notifications = await Notification.find({ recipient: userId })
        .populate("sender", "Username ProfileImage")
        .sort({ createdAt: -1 })
        .limit(50);

    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
    });

    return res.status(200).json(
        new ApiResponse(200, { notifications, unreadCount }, "Notifications fetched")
    );
});

const markNotificationsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { notificationIds } = req.body;

    if (notificationIds && notificationIds.length > 0) {
        await Notification.updateMany(
            { _id: { $in: notificationIds }, recipient: userId },
            { $set: { isRead: true } }
        );
    } else {
        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { $set: { isRead: true } }
        );
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Notifications marked as read")
    );
});

module.exports = {
    createOrGetConversation,
    getMessagesByConversation,
    searchMessages,
    deleteMessage,
    editMessage,
    getNotifications,
    markNotificationsRead,
};
