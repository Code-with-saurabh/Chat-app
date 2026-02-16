const mongoose = require("mongoose")
const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        enum: ["message", "friend_request"],
    },
    isRead: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

module.exports = mongoose.model("notification",notificationSchema)