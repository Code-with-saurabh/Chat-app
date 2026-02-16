const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    ProfileImage: {
        type: String,
        default: null,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastSeen: {
        type: Date,
    }
}, { timestamps: true });


module.exports = mongoose.model("MainUser",userSchema)