const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/env");

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

userSchema.pre('save', function (next) {
    if (this.isModified('Password')) {
        this.Password = bcrypt.hashSync(this.Password, 10);
    }
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.Password);
};

userSchema.methods.accessToken = async function () {
    const payload = {
        id: this._id,
        username: this.Username,
        email: this.Email,
    };
    return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
};

userSchema.methods.refershhToken = async function () {
    const payload = {
        id: this._id,
        username: this.Username,
        email: this.Email,
    };
    return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: '30d' });
};

module.exports = mongoose.model("MainUser", userSchema);
