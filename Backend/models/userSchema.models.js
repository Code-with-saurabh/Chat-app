const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

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
        this.Password = bcryptjs.hashSync(this.Password, 10);
    }
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.Password);
}

userSchema.methods.accessToken = async function () {
    const payload = {
        id: this._id,
        username: this.Username,
        email: this.Email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

userSchema.methods.refershhToken = async function () {
    const payload = {
        id: this._id,
        username: this.Username,
        email: this.Email,
    };
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    return token;
}


module.exports = mongoose.model("MainUser", userSchema)