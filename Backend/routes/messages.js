const express = require('express');
const router = express.Router();
const { createOrGetConversation, getMessagesByConversation } = require('../Controller/conversation.controller.js');
const verifyJWT = require('../Middleware/Auth.middleware.js');

router.post("/conversation", verifyJWT, createOrGetConversation);
router.get("/conversation/:conversationId", verifyJWT, getMessagesByConversation);

module.exports = router;
