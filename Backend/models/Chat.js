const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: Date, required: true, default: Date.now },
  isRead: { type: Boolean, default: false },
});

const Message = mongoose.model("ChatMessage", MessageSchema);
module.exports = Message;