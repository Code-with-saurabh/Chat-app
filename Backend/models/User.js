const mongoose = require('mongoose');

const UserScema = mongoose.Schema({
	Username:{type:String,require:true,unique:true},
	Password:{type:String,require:true,unique:true},
	Email:{type:String,require:true,unique:true},
	
	ProfileImage: { type: Buffer},
});

// const User = mongoose.model("ChatUser",UserScema);
const User = mongoose.model("AllChatUsers",UserScema);
module.exports=User;