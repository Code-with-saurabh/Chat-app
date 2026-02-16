const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    media: {
        type: String, // Cloudinary URL
        default: null,
    },
    messageType: {
        type: String,
        enum: ["text", "image", "video", "audio", "file"],
        default: "text",
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

module.exports = mongoose.model("message",messageSchema)