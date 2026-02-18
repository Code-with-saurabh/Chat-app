const Conversation = require("../models/conversation");
const ApiResponse = require("../Utilities/ApiResponse");
const asyncHandler = require("../Utilities/AsyncHandler");

const createOrGetConversation = asyncHandler(async (req, res) => {

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

module.exports = { createOrGetConversation };
