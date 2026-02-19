const Conversation = require("../models/conversationSchema.models.js");
const ApiResponse = require("../Utilities/ApiResponse");
const asyncHandler = require("../Utilities/AsyncHandler");
const ApiError = require("../Utilities/ApiError.js");
const Message = require("../models/messageSchema.models.js");

const createOrGetConversation = asyncHandler(async (req, res) => {
    console.log("createOrGetConversation called with body:", req.body);

    const senderId = req.user._id; // from verifyJWT
    const { receiverId } = req.body;

    if (!receiverId) {
        throw new ApiError(400, "receiverId required");
    }

    // find existing chat
    let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
        isGroup: false,
    });

    // if exists → return
    if (conversation) {
        return res.status(200).json(
            new ApiResponse(200, conversation, "Conversation exists")
        );
    }

    // else create
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
        throw new Error("ConversationId required");
    }

    // find messages
    const messages = await Message.find({
        conversationId: conversationId,
    })
        .sort({ createdAt: 1 }); // oldest → newest

    return res.status(200).json(
        new ApiResponse(
            200,
            messages,
            "Messages fetched successfully"
        )
    );
});



module.exports = { createOrGetConversation, getMessagesByConversation };

