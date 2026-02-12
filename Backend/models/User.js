const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	Username: { type: String, required: true, unique: true },
	Password: { type: String, required: true },
	Email: { type: String, required: true, unique: true },
	ProfileImage: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
