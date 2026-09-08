const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "conversation",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MainUser",
        required: true,
    },
    text: {
        type: String,
    },
    media: {
        type: String,
        default: null,
    },
    messageType: {
        type: String,
        enum: ["text", "image", "video", "audio", "file"],
        default: "text",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MainUser"
    }]
}, { timestamps: true });

module.exports = mongoose.model("message", messageSchema)