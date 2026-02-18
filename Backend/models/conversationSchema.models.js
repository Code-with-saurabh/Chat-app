const mongoose = require("mongoose")

const conversationSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MainUser",
        }
    ],
    isGroup: {
        type: Boolean,
        default: false,
    },
    groupName: String,
    groupImage: String,
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    }
}, { timestamps: true });


module.exports = mongoose.model("conversation", conversationSchema)