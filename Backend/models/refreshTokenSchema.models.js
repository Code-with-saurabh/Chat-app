const mongoose = require("mongoose")
const refreshTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MainUser",
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model("refreshToken", refreshTokenSchema)