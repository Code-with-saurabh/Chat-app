const mongoose = require('mongoose');

const UserScema = mongoose.Schema({
	Username:{type:String,require:true,unique:true},
	Password:{type:String,require:true,unique:true},
	Email:{type:String,require:true,unique:true},
	
	ProfileImage: { type: String},
});

// const User = mongoose.model("ChatUser",UserScema);
const User = mongoose.model(process.env.DATABASE_NAME,UserScema);
module.exports=User;