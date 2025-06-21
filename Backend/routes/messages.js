const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat.js')

router.post('/',async (req,res)=>{
	try{
		const {sender,reciver,message} = req.body;
		const newMessage = new Chat({sender,reciver,message});
		await newMessage.save();
		
		res.status(201).json(newMessage);
	}catch(err){
		res.status(500).json({error : "Failed to  save message"});
	}
});
 
/*router.get("/:user1/:user2",async (req,res)=>{
	try{
		const {user1,user2} = req.params;
		const messages = await  Chat.find({
			$or: [
			{sender:user1,reciver:user2},
			{sender:user2,reciver:user1},
			]
		}).sort({time:1});
		
		res.json(messages);
		
	}catch(err){
		
		res.status(500).json({error:"Failed to load messages"});
	}
});
 */
 
router.get("/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Chat.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ]
    }).sort({ time: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to load messages" });
  }
});


module.exports = router;
