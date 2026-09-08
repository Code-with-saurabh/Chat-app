const express = require('express');
const router = express.Router();
const {
    createOrGetConversation,
    getMessagesByConversation,
    searchMessages,
    deleteMessage,
    editMessage,
    getNotifications,
    markNotificationsRead,
} = require('../Controller/conversation.controller.js');
const verifyJWT = require('../Middleware/Auth.middleware.js');

router.post("/conversation", verifyJWT, createOrGetConversation);
router.get("/conversation/:conversationId", verifyJWT, getMessagesByConversation);
router.get("/search/:conversationId", verifyJWT, searchMessages);
router.put("/edit/:messageId", verifyJWT, editMessage);
router.delete("/delete/:messageId", verifyJWT, deleteMessage);

router.get("/notifications", verifyJWT, getNotifications);
router.put("/notifications/read", verifyJWT, markNotificationsRead);

module.exports = router;
